import { S as StandardHandler, t as traverseContractProcedures, g as getLazyMeta, u as unlazy, a as getRouter, i as isProcedure, c as createContractedProcedure, F as FetchHandler, r as resolveContractProcedures } from "./orpc__server.mjs";
import { f as fallbackContractConfig, g as getEventIteratorSchemaDetails } from "./orpc__contract.mjs";
import { i as isObject, s as stringifyJSON, v as value, t as tryDecodeURIComponent, j as toArray, n as clone, q as findDeepMatches, o as once } from "./orpc__shared.mjs";
import { c as createRouter, f as findRoute, b as addRoute } from "./rou3.mjs";
import { S as StandardOpenAPIJsonSerializer, a as StandardBracketNotationSerializer, b as StandardOpenAPISerializer, s as standardizeHTTPPath, g as getDynamicParams } from "./orpc__openapi-client.mjs";
import { t as toHttpPath, i as isORPCErrorStatus, f as fallbackORPCErrorStatus, e as fallbackORPCErrorMessage } from "./orpc__client.mjs";
import { T as TypeName } from "./json-schema-typed.mjs";
class StandardOpenAPICodec {
  constructor(serializer, options = {}) {
    this.serializer = serializer;
    this.customErrorResponseBodyEncoder = options.customErrorResponseBodyEncoder;
  }
  customErrorResponseBodyEncoder;
  async decode(request, params, procedure) {
    const inputStructure = fallbackContractConfig("defaultInputStructure", procedure["~orpc"].route.inputStructure);
    if (inputStructure === "compact") {
      const data = request.method === "GET" ? this.serializer.deserialize(request.url.searchParams) : this.serializer.deserialize(await request.body());
      if (data === void 0) {
        return params;
      }
      if (isObject(data)) {
        return {
          ...params,
          ...data
        };
      }
      return data;
    }
    const deserializeSearchParams = () => {
      return this.serializer.deserialize(request.url.searchParams);
    };
    return {
      params,
      get query() {
        const value2 = deserializeSearchParams();
        Object.defineProperty(this, "query", { value: value2, writable: true });
        return value2;
      },
      set query(value2) {
        Object.defineProperty(this, "query", { value: value2, writable: true });
      },
      headers: request.headers,
      body: this.serializer.deserialize(await request.body())
    };
  }
  encode(output, procedure) {
    const successStatus = fallbackContractConfig("defaultSuccessStatus", procedure["~orpc"].route.successStatus);
    const outputStructure = fallbackContractConfig("defaultOutputStructure", procedure["~orpc"].route.outputStructure);
    if (outputStructure === "compact") {
      return {
        status: successStatus,
        headers: {},
        body: this.serializer.serialize(output)
      };
    }
    if (!this.#isDetailedOutput(output)) {
      throw new Error(`
        Invalid "detailed" output structure:
        • Expected an object with optional properties:
          - status (number 200-399)
          - headers (Record<string, string | string[]>)
          - body (any)
        • No extra keys allowed.

        Actual value:
          ${stringifyJSON(output)}
      `);
    }
    return {
      status: output.status ?? successStatus,
      headers: output.headers ?? {},
      body: this.serializer.serialize(output.body)
    };
  }
  encodeError(error) {
    const body = this.customErrorResponseBodyEncoder?.(error) ?? error.toJSON();
    return {
      status: error.status,
      headers: {},
      body: this.serializer.serialize(body, { outputFormat: "plain" })
    };
  }
  #isDetailedOutput(output) {
    if (!isObject(output)) {
      return false;
    }
    if (output.headers && !isObject(output.headers)) {
      return false;
    }
    if (output.status !== void 0 && (typeof output.status !== "number" || !Number.isInteger(output.status) || isORPCErrorStatus(output.status))) {
      return false;
    }
    return true;
  }
}
function toRou3Pattern(path) {
  return standardizeHTTPPath(path).replace(/\/\{\+([^}]+)\}/g, "/**:$1").replace(/\/\{([^}]+)\}/g, "/:$1");
}
function decodeParams(params) {
  return Object.fromEntries(Object.entries(params).map(([key, value2]) => [key, tryDecodeURIComponent(value2)]));
}
class StandardOpenAPIMatcher {
  filter;
  tree = createRouter();
  pendingRouters = [];
  constructor(options = {}) {
    this.filter = options.filter ?? true;
  }
  init(router, path = []) {
    const laziedOptions = traverseContractProcedures({ router, path }, (traverseOptions) => {
      if (!value(this.filter, traverseOptions)) {
        return;
      }
      const { path: path2, contract } = traverseOptions;
      const method = fallbackContractConfig("defaultMethod", contract["~orpc"].route.method);
      const httpPath = toRou3Pattern(contract["~orpc"].route.path ?? toHttpPath(path2));
      if (isProcedure(contract)) {
        addRoute(this.tree, method, httpPath, {
          path: path2,
          contract,
          procedure: contract,
          // this mean dev not used contract-first so we can used contract as procedure directly
          router
        });
      } else {
        addRoute(this.tree, method, httpPath, {
          path: path2,
          contract,
          procedure: void 0,
          router
        });
      }
    });
    this.pendingRouters.push(...laziedOptions.map((option) => ({
      ...option,
      httpPathPrefix: toHttpPath(option.path),
      laziedPrefix: getLazyMeta(option.router).prefix
    })));
  }
  async match(method, pathname) {
    if (this.pendingRouters.length) {
      const newPendingRouters = [];
      for (const pendingRouter of this.pendingRouters) {
        if (!pendingRouter.laziedPrefix || pathname.startsWith(pendingRouter.laziedPrefix) || pathname.startsWith(pendingRouter.httpPathPrefix)) {
          const { default: router } = await unlazy(pendingRouter.router);
          this.init(router, pendingRouter.path);
        } else {
          newPendingRouters.push(pendingRouter);
        }
      }
      this.pendingRouters = newPendingRouters;
    }
    const match = findRoute(this.tree, method, pathname);
    if (!match) {
      return void 0;
    }
    if (!match.data.procedure) {
      const { default: maybeProcedure } = await unlazy(getRouter(match.data.router, match.data.path));
      if (!isProcedure(maybeProcedure)) {
        throw new Error(`
          [Contract-First] Missing or invalid implementation for procedure at path: ${toHttpPath(match.data.path)}.
          Ensure that the procedure is correctly defined and matches the expected contract.
        `);
      }
      match.data.procedure = createContractedProcedure(maybeProcedure, match.data.contract);
    }
    return {
      path: match.data.path,
      procedure: match.data.procedure,
      params: match.params ? decodeParams(match.params) : void 0
    };
  }
}
class StandardOpenAPIHandler extends StandardHandler {
  constructor(router, options) {
    const jsonSerializer = new StandardOpenAPIJsonSerializer(options);
    const bracketNotationSerializer = new StandardBracketNotationSerializer(options);
    const serializer = new StandardOpenAPISerializer(jsonSerializer, bracketNotationSerializer);
    const matcher = new StandardOpenAPIMatcher(options);
    const codec = new StandardOpenAPICodec(serializer, options);
    super(router, matcher, codec, options);
  }
}
class OpenAPIHandler extends FetchHandler {
  constructor(router, options = {}) {
    super(new StandardOpenAPIHandler(router, options), options);
  }
}
const OPERATION_EXTENDER_SYMBOL = /* @__PURE__ */ Symbol("ORPC_OPERATION_EXTENDER");
function getCustomOpenAPIOperation(o) {
  return o[OPERATION_EXTENDER_SYMBOL];
}
function applyCustomOpenAPIOperation(operation, contract) {
  const operationCustoms = [];
  for (const errorItem of Object.values(contract["~orpc"].errorMap)) {
    const maybeExtender = errorItem ? getCustomOpenAPIOperation(errorItem) : void 0;
    if (maybeExtender) {
      operationCustoms.push(maybeExtender);
    }
  }
  if (isProcedure(contract)) {
    for (const middleware of contract["~orpc"].middlewares) {
      const maybeExtender = getCustomOpenAPIOperation(middleware);
      if (maybeExtender) {
        operationCustoms.push(maybeExtender);
      }
    }
  }
  let currentOperation = operation;
  for (const custom of operationCustoms) {
    if (typeof custom === "function") {
      currentOperation = custom(currentOperation, contract);
    } else {
      currentOperation = {
        ...currentOperation,
        ...custom
      };
    }
  }
  return currentOperation;
}
const LOGIC_KEYWORDS = [
  "$dynamicRef",
  "$ref",
  "additionalItems",
  "additionalProperties",
  "allOf",
  "anyOf",
  "const",
  "contains",
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  "dependencies",
  "dependentRequired",
  "dependentSchemas",
  "else",
  "enum",
  "exclusiveMaximum",
  "exclusiveMinimum",
  "format",
  "if",
  "items",
  "maxContains",
  "maximum",
  "maxItems",
  "maxLength",
  "maxProperties",
  "minContains",
  "minimum",
  "minItems",
  "minLength",
  "minProperties",
  "multipleOf",
  "not",
  "oneOf",
  "pattern",
  "patternProperties",
  "prefixItems",
  "properties",
  "propertyNames",
  "required",
  "then",
  "type",
  "unevaluatedItems",
  "unevaluatedProperties",
  "uniqueItems"
];
function isFileSchema(schema) {
  return isObject(schema) && schema.type === "string" && typeof schema.contentMediaType === "string";
}
function isObjectSchema(schema) {
  return isObject(schema) && schema.type === "object";
}
function isAnySchema(schema) {
  if (schema === true) {
    return true;
  }
  if (Object.keys(schema).every((k) => !LOGIC_KEYWORDS.includes(k))) {
    return true;
  }
  return false;
}
function separateObjectSchema(schema, separatedProperties) {
  if (Object.keys(schema).some(
    (k) => !["type", "properties", "required", "additionalProperties"].includes(k) && LOGIC_KEYWORDS.includes(k) && schema[k] !== void 0
  )) {
    return [{ type: "object" }, schema];
  }
  const matched = { ...schema };
  const rest = { ...schema };
  matched.properties = separatedProperties.reduce((acc, key) => {
    const keySchema = schema.properties?.[key] ?? schema.additionalProperties;
    if (keySchema !== void 0) {
      acc[key] = keySchema;
    }
    return acc;
  }, {});
  matched.required = schema.required?.filter((key) => separatedProperties.includes(key));
  matched.examples = schema.examples?.map((example) => {
    if (!isObject(example)) {
      return example;
    }
    return Object.entries(example).reduce((acc, [key, value2]) => {
      if (separatedProperties.includes(key)) {
        acc[key] = value2;
      }
      return acc;
    }, {});
  });
  rest.properties = schema.properties && Object.entries(schema.properties).filter(([key]) => !separatedProperties.includes(key)).reduce((acc, [key, value2]) => {
    acc[key] = value2;
    return acc;
  }, {});
  rest.required = schema.required?.filter((key) => !separatedProperties.includes(key));
  rest.examples = schema.examples?.map((example) => {
    if (!isObject(example)) {
      return example;
    }
    return Object.entries(example).reduce((acc, [key, value2]) => {
      if (!separatedProperties.includes(key)) {
        acc[key] = value2;
      }
      return acc;
    }, {});
  });
  return [matched, rest];
}
function filterSchemaBranches(schema, check, matches = []) {
  if (check(schema)) {
    matches.push(schema);
    return [matches, void 0];
  }
  if (isObject(schema)) {
    for (const keyword of ["anyOf", "oneOf"]) {
      if (schema[keyword] && Object.keys(schema).every(
        (k) => k === keyword || !LOGIC_KEYWORDS.includes(k)
      )) {
        const rest = schema[keyword].map((s) => filterSchemaBranches(s, check, matches)[1]).filter((v) => !!v);
        if (rest.length === 1 && typeof rest[0] === "object") {
          return [matches, { ...schema, [keyword]: void 0, ...rest[0] }];
        }
        return [matches, { ...schema, [keyword]: rest }];
      }
    }
  }
  return [matches, schema];
}
function applySchemaOptionality(required, schema) {
  if (required) {
    return schema;
  }
  return {
    anyOf: [
      schema,
      { not: {} }
    ]
  };
}
function expandUnionSchema(schema) {
  if (typeof schema === "object") {
    for (const keyword of ["anyOf", "oneOf"]) {
      if (schema[keyword] && Object.keys(schema).every(
        (k) => k === keyword || !LOGIC_KEYWORDS.includes(k)
      )) {
        return schema[keyword].flatMap((s) => expandUnionSchema(s));
      }
    }
  }
  return [schema];
}
function expandArrayableSchema(schema) {
  const schemas = expandUnionSchema(schema);
  if (schemas.length !== 2) {
    return void 0;
  }
  const arraySchema = schemas.find(
    (s) => typeof s === "object" && s.type === "array" && Object.keys(s).filter((k) => LOGIC_KEYWORDS.includes(k)).every((k) => k === "type" || k === "items")
  );
  if (arraySchema === void 0) {
    return void 0;
  }
  const items1 = arraySchema.items;
  const items2 = schemas.find((s) => s !== arraySchema);
  if (stringifyJSON(items1) !== stringifyJSON(items2)) {
    return void 0;
  }
  return [items2, arraySchema];
}
const PRIMITIVE_SCHEMA_TYPES = /* @__PURE__ */ new Set([
  TypeName.String,
  TypeName.Number,
  TypeName.Integer,
  TypeName.Boolean,
  TypeName.Null
]);
function isPrimitiveSchema(schema) {
  return expandUnionSchema(schema).every((s) => {
    if (typeof s === "boolean") {
      return false;
    }
    if (typeof s.type === "string" && PRIMITIVE_SCHEMA_TYPES.has(s.type)) {
      return true;
    }
    if (s.const !== void 0) {
      return true;
    }
    return false;
  });
}
function toOpenAPIPath(path) {
  return standardizeHTTPPath(path).replace(/\/\{\+([^}]+)\}/g, "/{$1}");
}
function toOpenAPIMethod(method) {
  return method.toLocaleLowerCase();
}
function toOpenAPIContent(schema) {
  const content = {};
  const [matches, restSchema] = filterSchemaBranches(schema, isFileSchema);
  for (const file of matches) {
    content[file.contentMediaType] = {
      schema: toOpenAPISchema(file)
    };
  }
  if (restSchema !== void 0) {
    content["application/json"] = {
      schema: toOpenAPISchema(restSchema)
    };
    const isStillHasFileSchema = findDeepMatches((v) => isObject(v) && isFileSchema(v), restSchema).values.length > 0;
    if (isStillHasFileSchema) {
      content["multipart/form-data"] = {
        schema: toOpenAPISchema(restSchema)
      };
    }
  }
  return content;
}
function toOpenAPIEventIteratorContent([yieldsRequired, yieldsSchema], [returnsRequired, returnsSchema]) {
  return {
    "text/event-stream": {
      schema: toOpenAPISchema({
        oneOf: [
          {
            type: "object",
            properties: {
              event: { const: "message" },
              data: yieldsSchema,
              id: { type: "string" },
              retry: { type: "number" }
            },
            required: yieldsRequired ? ["event", "data"] : ["event"]
          },
          {
            type: "object",
            properties: {
              event: { const: "done" },
              data: returnsSchema,
              id: { type: "string" },
              retry: { type: "number" }
            },
            required: returnsRequired ? ["event", "data"] : ["event"]
          },
          {
            type: "object",
            properties: {
              event: { const: "error" },
              data: {},
              id: { type: "string" },
              retry: { type: "number" }
            },
            required: ["event"]
          }
        ]
      })
    }
  };
}
function toOpenAPIParameters(schema, parameterIn) {
  const parameters = [];
  for (const key in schema.properties) {
    const keySchema = schema.properties[key];
    let isDeepObjectStyle = true;
    if (parameterIn !== "query") {
      isDeepObjectStyle = false;
    } else if (isPrimitiveSchema(keySchema)) {
      isDeepObjectStyle = false;
    } else {
      const [item] = expandArrayableSchema(keySchema) ?? [];
      if (item !== void 0 && isPrimitiveSchema(item)) {
        isDeepObjectStyle = false;
      }
    }
    parameters.push({
      name: key,
      in: parameterIn,
      required: schema.required?.includes(key),
      schema: toOpenAPISchema(keySchema),
      style: isDeepObjectStyle ? "deepObject" : void 0,
      explode: isDeepObjectStyle ? true : void 0,
      allowEmptyValue: parameterIn === "query" ? true : void 0,
      allowReserved: parameterIn === "query" ? true : void 0
    });
  }
  return parameters;
}
function checkParamsSchema(schema, params) {
  const properties = Object.keys(schema.properties ?? {});
  const required = schema.required ?? [];
  if (properties.length !== params.length || properties.some((v) => !params.includes(v))) {
    return false;
  }
  if (required.length !== params.length || required.some((v) => !params.includes(v))) {
    return false;
  }
  return true;
}
function toOpenAPISchema(schema) {
  return schema === true ? {} : schema === false ? { not: {} } : schema;
}
const OPENAPI_JSON_SCHEMA_REF_PREFIX = "#/components/schemas/";
function resolveOpenAPIJsonSchemaRef(doc, schema) {
  if (typeof schema !== "object" || !schema.$ref?.startsWith(OPENAPI_JSON_SCHEMA_REF_PREFIX)) {
    return schema;
  }
  const name = schema.$ref.slice(OPENAPI_JSON_SCHEMA_REF_PREFIX.length);
  const resolved = doc.components?.schemas?.[name];
  return resolved ?? schema;
}
function simplifyComposedObjectJsonSchemasAndRefs(schema, doc) {
  if (doc) {
    schema = resolveOpenAPIJsonSchemaRef(doc, schema);
  }
  if (typeof schema !== "object" || !schema.anyOf && !schema.oneOf && !schema.allOf) {
    return schema;
  }
  const unionSchemas = [
    ...toArray(schema.anyOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc))),
    ...toArray(schema.oneOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc)))
  ];
  const objectUnionSchemas = [];
  for (const u of unionSchemas) {
    if (!isObjectSchema(u)) {
      return schema;
    }
    objectUnionSchemas.push(u);
  }
  const mergedUnionPropertyMap = /* @__PURE__ */ new Map();
  for (const u of objectUnionSchemas) {
    if (u.properties) {
      for (const [key, value2] of Object.entries(u.properties)) {
        let entry = mergedUnionPropertyMap.get(key);
        if (!entry) {
          const required = objectUnionSchemas.every((s) => s.required?.includes(key));
          entry = { required, schemas: [] };
          mergedUnionPropertyMap.set(key, entry);
        }
        entry.schemas.push(value2);
      }
    }
  }
  const intersectionSchemas = toArray(schema.allOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc)));
  const objectIntersectionSchemas = [];
  for (const u of intersectionSchemas) {
    if (!isObjectSchema(u)) {
      return schema;
    }
    objectIntersectionSchemas.push(u);
  }
  if (isObjectSchema(schema)) {
    objectIntersectionSchemas.push(schema);
  }
  const mergedInteractionPropertyMap = /* @__PURE__ */ new Map();
  for (const u of objectIntersectionSchemas) {
    if (u.properties) {
      for (const [key, value2] of Object.entries(u.properties)) {
        let entry = mergedInteractionPropertyMap.get(key);
        if (!entry) {
          const required = objectIntersectionSchemas.some((s) => s.required?.includes(key));
          entry = { required, schemas: [] };
          mergedInteractionPropertyMap.set(key, entry);
        }
        entry.schemas.push(value2);
      }
    }
  }
  const resultObjectSchema = { type: "object", properties: {}, required: [] };
  const keys = /* @__PURE__ */ new Set([
    ...mergedUnionPropertyMap.keys(),
    ...mergedInteractionPropertyMap.keys()
  ]);
  if (keys.size === 0) {
    return schema;
  }
  const deduplicateSchemas = (schemas) => {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const schema2 of schemas) {
      const key = stringifyJSON(schema2);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(schema2);
      }
    }
    return result;
  };
  for (const key of keys) {
    const unionEntry = mergedUnionPropertyMap.get(key);
    const intersectionEntry = mergedInteractionPropertyMap.get(key);
    resultObjectSchema.properties[key] = (() => {
      const dedupedUnionSchemas = unionEntry ? deduplicateSchemas(unionEntry.schemas) : [];
      const dedupedIntersectionSchemas = intersectionEntry ? deduplicateSchemas(intersectionEntry.schemas) : [];
      if (!dedupedUnionSchemas.length) {
        return dedupedIntersectionSchemas.length === 1 ? dedupedIntersectionSchemas[0] : { allOf: dedupedIntersectionSchemas };
      }
      if (!dedupedIntersectionSchemas.length) {
        return dedupedUnionSchemas.length === 1 ? dedupedUnionSchemas[0] : { anyOf: dedupedUnionSchemas };
      }
      const allOf = deduplicateSchemas([
        ...dedupedIntersectionSchemas,
        dedupedUnionSchemas.length === 1 ? dedupedUnionSchemas[0] : { anyOf: dedupedUnionSchemas }
      ]);
      return allOf.length === 1 ? allOf[0] : { allOf };
    })();
    if (unionEntry?.required || intersectionEntry?.required) {
      resultObjectSchema.required.push(key);
    }
  }
  return resultObjectSchema;
}
class CompositeSchemaConverter {
  converters;
  constructor(converters) {
    this.converters = converters;
  }
  async convert(schema, options) {
    for (const converter of this.converters) {
      if (await converter.condition(schema, options)) {
        return converter.convert(schema, options);
      }
    }
    return [false, {}];
  }
}
class OpenAPIGeneratorError extends Error {
}
class OpenAPIGenerator {
  serializer;
  converter;
  constructor(options = {}) {
    this.serializer = new StandardOpenAPIJsonSerializer(options);
    this.converter = new CompositeSchemaConverter(toArray(options.schemaConverters));
  }
  /**
   * Generates OpenAPI specifications from oRPC routers/contracts.
   *
   * @see {@link https://orpc.dev/docs/openapi/openapi-specification OpenAPI Specification Docs}
   */
  async generate(router, { customErrorResponseBodySchema, commonSchemas, filter: baseFilter, exclude, ...baseDoc } = {}) {
    const filter = baseFilter ?? (({ contract, path }) => {
      return !(exclude?.(contract, path) ?? false);
    });
    const doc = {
      ...clone(baseDoc),
      info: baseDoc.info ?? { title: "API Reference", version: "0.0.0" },
      openapi: "3.1.1"
    };
    const { baseSchemaConvertOptions, undefinedErrorJsonSchema } = await this.#resolveCommonSchemas(doc, commonSchemas);
    const contracts = [];
    await resolveContractProcedures({ path: [], router }, (traverseOptions) => {
      if (!value(filter, traverseOptions)) {
        return;
      }
      contracts.push(traverseOptions);
    });
    const errors = [];
    for (const { contract, path } of contracts) {
      const stringPath = path.join(".");
      try {
        const def = contract["~orpc"];
        const method = toOpenAPIMethod(fallbackContractConfig("defaultMethod", def.route.method));
        const httpPath = toOpenAPIPath(def.route.path ?? toHttpPath(path));
        let operationObjectRef;
        if (def.route.spec !== void 0 && typeof def.route.spec !== "function") {
          operationObjectRef = def.route.spec;
        } else {
          operationObjectRef = {
            operationId: def.route.operationId ?? stringPath,
            summary: def.route.summary,
            description: def.route.description,
            deprecated: def.route.deprecated,
            tags: def.route.tags?.map((tag) => tag)
          };
          await this.#request(doc, operationObjectRef, def, baseSchemaConvertOptions);
          await this.#successResponse(doc, operationObjectRef, def, baseSchemaConvertOptions);
          await this.#errorResponse(operationObjectRef, def, baseSchemaConvertOptions, undefinedErrorJsonSchema, customErrorResponseBodySchema);
        }
        if (typeof def.route.spec === "function") {
          operationObjectRef = def.route.spec(operationObjectRef);
        }
        doc.paths ??= {};
        doc.paths[httpPath] ??= {};
        doc.paths[httpPath][method] = applyCustomOpenAPIOperation(operationObjectRef, contract);
      } catch (e) {
        if (!(e instanceof OpenAPIGeneratorError)) {
          throw e;
        }
        errors.push(
          `[OpenAPIGenerator] Error occurred while generating OpenAPI for procedure at path: ${stringPath}
${e.message}`
        );
      }
    }
    if (errors.length) {
      throw new OpenAPIGeneratorError(
        `Some error occurred during OpenAPI generation:

${errors.join("\n\n")}`
      );
    }
    return this.serializer.serialize(doc)[0];
  }
  async #resolveCommonSchemas(doc, commonSchemas) {
    let undefinedErrorJsonSchema = {
      type: "object",
      properties: {
        defined: { const: false },
        code: { type: "string" },
        status: { type: "number" },
        message: { type: "string" },
        data: {}
      },
      required: ["defined", "code", "status", "message"]
    };
    const baseSchemaConvertOptions = {};
    if (commonSchemas) {
      baseSchemaConvertOptions.components = [];
      for (const key in commonSchemas) {
        const options = commonSchemas[key];
        if (options.schema === void 0) {
          continue;
        }
        const { schema, strategy = "input" } = options;
        const [required, json] = await this.converter.convert(schema, { strategy });
        const allowedStrategies = [strategy];
        if (strategy === "input") {
          const [outputRequired, outputJson] = await this.converter.convert(schema, { strategy: "output" });
          if (outputRequired === required && stringifyJSON(outputJson) === stringifyJSON(json)) {
            allowedStrategies.push("output");
          }
        } else if (strategy === "output") {
          const [inputRequired, inputJson] = await this.converter.convert(schema, { strategy: "input" });
          if (inputRequired === required && stringifyJSON(inputJson) === stringifyJSON(json)) {
            allowedStrategies.push("input");
          }
        }
        baseSchemaConvertOptions.components.push({
          schema,
          required,
          ref: `#/components/schemas/${key}`,
          allowedStrategies
        });
      }
      doc.components ??= {};
      doc.components.schemas ??= {};
      for (const key in commonSchemas) {
        const options = commonSchemas[key];
        if (options.schema === void 0) {
          if (options.error === "UndefinedError") {
            doc.components.schemas[key] = toOpenAPISchema(undefinedErrorJsonSchema);
            undefinedErrorJsonSchema = { $ref: `#/components/schemas/${key}` };
          }
          continue;
        }
        const { schema, strategy = "input" } = options;
        const [, json] = await this.converter.convert(
          schema,
          {
            ...baseSchemaConvertOptions,
            strategy,
            minStructureDepthForRef: 1
            // not allow use $ref for root schemas
          }
        );
        doc.components.schemas[key] = toOpenAPISchema(json);
      }
    }
    return { baseSchemaConvertOptions, undefinedErrorJsonSchema };
  }
  async #request(doc, ref, def, baseSchemaConvertOptions) {
    const method = fallbackContractConfig("defaultMethod", def.route.method);
    const details = getEventIteratorSchemaDetails(def.inputSchema);
    if (details) {
      ref.requestBody = {
        required: true,
        content: toOpenAPIEventIteratorContent(
          await this.converter.convert(details.yields, { ...baseSchemaConvertOptions, strategy: "input" }),
          await this.converter.convert(details.returns, { ...baseSchemaConvertOptions, strategy: "input" })
        )
      };
      return;
    }
    const dynamicParams = getDynamicParams(def.route.path)?.map((v) => v.name);
    const inputStructure = fallbackContractConfig("defaultInputStructure", def.route.inputStructure);
    let [required, schema] = await this.converter.convert(
      def.inputSchema,
      {
        ...baseSchemaConvertOptions,
        strategy: "input"
      }
    );
    if (isAnySchema(schema) && !dynamicParams?.length) {
      return;
    }
    if (inputStructure === "detailed" || inputStructure === "compact" && (dynamicParams?.length || method === "GET")) {
      schema = simplifyComposedObjectJsonSchemasAndRefs(schema, doc);
    }
    if (inputStructure === "compact") {
      if (dynamicParams?.length) {
        const error2 = new OpenAPIGeneratorError(
          'When input structure is "compact", and path has dynamic params, input schema must be an object with all dynamic params as required.'
        );
        if (!isObjectSchema(schema)) {
          throw error2;
        }
        const [paramsSchema, rest] = separateObjectSchema(schema, dynamicParams);
        schema = rest;
        required = rest.required ? rest.required.length !== 0 : false;
        if (!checkParamsSchema(paramsSchema, dynamicParams)) {
          throw error2;
        }
        ref.parameters ??= [];
        ref.parameters.push(...toOpenAPIParameters(paramsSchema, "path"));
      }
      if (method === "GET") {
        if (!isObjectSchema(schema)) {
          throw new OpenAPIGeneratorError(
            'When method is "GET", input schema must satisfy: object | any | unknown'
          );
        }
        ref.parameters ??= [];
        ref.parameters.push(...toOpenAPIParameters(schema, "query"));
      } else {
        ref.requestBody = {
          required,
          content: toOpenAPIContent(schema)
        };
      }
      return;
    }
    const error = new OpenAPIGeneratorError(
      'When input structure is "detailed", input schema must satisfy: { params?: Record<string, unknown>, query?: Record<string, unknown>, headers?: Record<string, unknown>, body?: unknown }'
    );
    if (!isObjectSchema(schema)) {
      throw error;
    }
    const resolvedParamSchema = schema.properties?.params !== void 0 ? simplifyComposedObjectJsonSchemasAndRefs(schema.properties.params, doc) : void 0;
    if (dynamicParams?.length && (resolvedParamSchema === void 0 || !isObjectSchema(resolvedParamSchema) || !checkParamsSchema(resolvedParamSchema, dynamicParams))) {
      throw new OpenAPIGeneratorError(
        'When input structure is "detailed" and path has dynamic params, the "params" schema must be an object with all dynamic params as required.'
      );
    }
    for (const from of ["params", "query", "headers"]) {
      const fromSchema = schema.properties?.[from];
      if (fromSchema !== void 0) {
        const resolvedSchema = simplifyComposedObjectJsonSchemasAndRefs(fromSchema, doc);
        if (!isObjectSchema(resolvedSchema)) {
          throw error;
        }
        const parameterIn = from === "params" ? "path" : from === "headers" ? "header" : "query";
        ref.parameters ??= [];
        ref.parameters.push(...toOpenAPIParameters(resolvedSchema, parameterIn));
      }
    }
    if (schema.properties?.body !== void 0) {
      ref.requestBody = {
        required: schema.required?.includes("body"),
        content: toOpenAPIContent(schema.properties.body)
      };
    }
  }
  async #successResponse(doc, ref, def, baseSchemaConvertOptions) {
    const outputSchema = def.outputSchema;
    const status = fallbackContractConfig("defaultSuccessStatus", def.route.successStatus);
    const description = fallbackContractConfig("defaultSuccessDescription", def.route?.successDescription);
    const eventIteratorSchemaDetails = getEventIteratorSchemaDetails(outputSchema);
    const outputStructure = fallbackContractConfig("defaultOutputStructure", def.route.outputStructure);
    if (eventIteratorSchemaDetails) {
      ref.responses ??= {};
      ref.responses[status] = {
        description,
        content: toOpenAPIEventIteratorContent(
          await this.converter.convert(eventIteratorSchemaDetails.yields, { ...baseSchemaConvertOptions, strategy: "output" }),
          await this.converter.convert(eventIteratorSchemaDetails.returns, { ...baseSchemaConvertOptions, strategy: "output" })
        )
      };
      return;
    }
    const [required, json] = await this.converter.convert(
      outputSchema,
      {
        ...baseSchemaConvertOptions,
        strategy: "output",
        minStructureDepthForRef: outputStructure === "detailed" ? 1 : 0
      }
    );
    if (outputStructure === "compact") {
      ref.responses ??= {};
      ref.responses[status] = {
        description
      };
      ref.responses[status].content = toOpenAPIContent(applySchemaOptionality(required, json));
      return;
    }
    const handledStatuses = /* @__PURE__ */ new Set();
    for (const item of expandUnionSchema(json)) {
      const error = new OpenAPIGeneratorError(`
        When output structure is "detailed", output schema must satisfy:
        { 
          status?: number, // must be a literal number and in the range of 200-399
          headers?: Record<string, unknown>, 
          body?: unknown 
        }
        
        But got: ${stringifyJSON(item)}
      `);
      const simplifiedItem = simplifyComposedObjectJsonSchemasAndRefs(item, doc);
      if (!isObjectSchema(simplifiedItem)) {
        throw error;
      }
      let schemaStatus;
      let schemaDescription;
      if (simplifiedItem.properties?.status !== void 0) {
        const statusSchema = resolveOpenAPIJsonSchemaRef(doc, simplifiedItem.properties.status);
        if (typeof statusSchema !== "object" || statusSchema.const === void 0 || typeof statusSchema.const !== "number" || !Number.isInteger(statusSchema.const) || isORPCErrorStatus(statusSchema.const)) {
          throw error;
        }
        schemaStatus = statusSchema.const;
        schemaDescription = statusSchema.description;
      }
      const itemStatus = schemaStatus ?? status;
      const itemDescription = schemaDescription ?? description;
      if (handledStatuses.has(itemStatus)) {
        throw new OpenAPIGeneratorError(`
          When output structure is "detailed", each success status must be unique.
          But got status: ${itemStatus} used more than once.
        `);
      }
      handledStatuses.add(itemStatus);
      ref.responses ??= {};
      ref.responses[itemStatus] = {
        description: itemDescription
      };
      if (simplifiedItem.properties?.headers !== void 0) {
        const headersSchema = simplifyComposedObjectJsonSchemasAndRefs(simplifiedItem.properties.headers, doc);
        if (!isObjectSchema(headersSchema)) {
          throw error;
        }
        for (const key in headersSchema.properties) {
          const headerSchema = headersSchema.properties[key];
          if (headerSchema !== void 0) {
            ref.responses[itemStatus].headers ??= {};
            ref.responses[itemStatus].headers[key] = {
              schema: toOpenAPISchema(headerSchema),
              required: simplifiedItem.required?.includes("headers") && headersSchema.required?.includes(key)
            };
          }
        }
      }
      if (simplifiedItem.properties?.body !== void 0) {
        ref.responses[itemStatus].content = toOpenAPIContent(
          applySchemaOptionality(simplifiedItem.required?.includes("body") ?? false, simplifiedItem.properties.body)
        );
      }
    }
  }
  async #errorResponse(ref, def, baseSchemaConvertOptions, undefinedErrorSchema, customErrorResponseBodySchema) {
    const errorMap = def.errorMap;
    const errorResponsesByStatus = {};
    for (const code in errorMap) {
      const config = errorMap[code];
      if (!config) {
        continue;
      }
      const status = fallbackORPCErrorStatus(code, config.status);
      const defaultMessage = fallbackORPCErrorMessage(code, config.message);
      errorResponsesByStatus[status] ??= { status, definedErrorDefinitions: [], errorSchemaVariants: [] };
      const [dataRequired, dataSchema] = await this.converter.convert(config.data, { ...baseSchemaConvertOptions, strategy: "output" });
      errorResponsesByStatus[status].definedErrorDefinitions.push([code, defaultMessage, dataRequired, dataSchema]);
      errorResponsesByStatus[status].errorSchemaVariants.push({
        type: "object",
        properties: {
          defined: { const: true },
          code: { const: code },
          status: { const: status },
          message: { type: "string", default: defaultMessage },
          data: dataSchema
        },
        required: dataRequired ? ["defined", "code", "status", "message", "data"] : ["defined", "code", "status", "message"]
      });
    }
    ref.responses ??= {};
    for (const statusString in errorResponsesByStatus) {
      const errorResponse = errorResponsesByStatus[statusString];
      const customBodySchema = value(customErrorResponseBodySchema, errorResponse.definedErrorDefinitions, errorResponse.status);
      ref.responses[statusString] = {
        description: statusString,
        content: toOpenAPIContent(customBodySchema ?? {
          oneOf: [
            ...errorResponse.errorSchemaVariants,
            undefinedErrorSchema
          ]
        })
      };
    }
  }
}
class OpenAPIReferencePlugin {
  generator;
  specGenerateOptions;
  specPath;
  docsPath;
  docsTitle;
  docsHead;
  docsProvider;
  docsScriptUrl;
  docsCssUrl;
  docsConfig;
  renderDocsHtml;
  constructor(options = {}) {
    this.specGenerateOptions = options.specGenerateOptions;
    this.docsPath = options.docsPath ?? "/";
    this.docsTitle = options.docsTitle ?? "API Reference";
    this.docsConfig = options.docsConfig ?? void 0;
    this.docsProvider = options.docsProvider ?? "scalar";
    this.docsScriptUrl = options.docsScriptUrl ?? (this.docsProvider === "swagger" ? "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js" : "https://cdn.jsdelivr.net/npm/@scalar/api-reference");
    this.docsCssUrl = options.docsCssUrl ?? (this.docsProvider === "swagger" ? "https://unpkg.com/swagger-ui-dist/swagger-ui.css" : void 0);
    this.docsHead = options.docsHead ?? "";
    this.specPath = options.specPath ?? "/spec.json";
    this.generator = new OpenAPIGenerator(options);
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    this.renderDocsHtml = options.renderDocsHtml ?? ((specUrl, title, head, scriptUrl, config, spec, docsProvider, cssUrl) => {
      let body;
      if (docsProvider === "swagger") {
        const swaggerConfig = {
          dom_id: "#app",
          spec,
          deepLinking: true,
          presets: [
            "SwaggerUIBundle.presets.apis",
            "SwaggerUIBundle.presets.standalone"
          ],
          plugins: [
            "SwaggerUIBundle.plugins.DownloadUrl"
          ],
          ...config
        };
        body = `
        <body>
          <div id="app"></div>

          <script src="${esc(scriptUrl)}"><\/script>

          <script>
            window.onload = () => {
              window.ui = SwaggerUIBundle(${stringifyJSON(swaggerConfig).replace(/"(SwaggerUIBundle\.[^"]+)"/g, "$1")})
            }
          <\/script>
        </body>
        `;
      } else {
        const scalarConfig = {
          content: stringifyJSON(spec),
          ...config
        };
        body = `
        <body>
          <div id="app" data-config="${esc(stringifyJSON(scalarConfig))}"></div>

          <script src="${esc(scriptUrl)}"><\/script>

          <script>
            Scalar.createApiReference('#app', JSON.parse(document.getElementById('app').dataset.config))
          <\/script>
        </body>
        `;
      }
      return `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${esc(title)}</title>
            ${cssUrl ? `<link rel="stylesheet" type="text/css" href="${esc(cssUrl)}" />` : ""}
            ${head}
          </head>
          ${body}
        </html>
        `;
    });
  }
  init(options, router) {
    options.interceptors ??= [];
    options.interceptors.push(async (options2) => {
      const res = await options2.next();
      if (res.matched || options2.request.method !== "GET") {
        return res;
      }
      const prefix = options2.prefix ?? "";
      const requestPathname = options2.request.url.pathname.replace(/\/$/, "") || "/";
      const docsUrl = new URL(`${prefix}${this.docsPath}`.replace(/\/$/, ""), options2.request.url.origin);
      const specUrl = new URL(`${prefix}${this.specPath}`.replace(/\/$/, ""), options2.request.url.origin);
      const generateSpec = once(async () => {
        return await this.generator.generate(router, {
          servers: [{ url: new URL(prefix, options2.request.url.origin).toString() }],
          ...await value(this.specGenerateOptions, options2)
        });
      });
      if (requestPathname === specUrl.pathname) {
        const spec = await generateSpec();
        return {
          matched: true,
          response: {
            status: 200,
            headers: {},
            body: new File([stringifyJSON(spec)], "spec.json", { type: "application/json" })
          }
        };
      }
      if (requestPathname === docsUrl.pathname) {
        const html = this.renderDocsHtml(
          specUrl.toString(),
          await value(this.docsTitle, options2),
          await value(this.docsHead, options2),
          await value(this.docsScriptUrl, options2),
          await value(this.docsConfig, options2),
          await generateSpec(),
          this.docsProvider,
          await value(this.docsCssUrl, options2)
        );
        return {
          matched: true,
          response: {
            status: 200,
            headers: {},
            body: new File([html], "api-reference.html", { type: "text/html" })
          }
        };
      }
      return res;
    });
  }
}
export {
  CompositeSchemaConverter as C,
  OpenAPIHandler as O,
  OpenAPIReferencePlugin as a
};
