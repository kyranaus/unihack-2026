import { c as createAdapterFactory, a as capitalizeFirstLetter } from "./better-auth__core.mjs";
import { K as Kysely, S as SqliteDialect, M as MysqlDialect, P as PostgresDialect, a as MssqlDialect, s as sql, C as CompiledQuery, D as DefaultQueryCompiler, b as DEFAULT_MIGRATION_TABLE, c as DEFAULT_MIGRATION_LOCK_TABLE, d as SqliteQueryCompiler, e as SqliteAdapter } from "./kysely.mjs";
function getKyselyDatabaseType(db) {
  if (!db) return null;
  if ("dialect" in db) return getKyselyDatabaseType(db.dialect);
  if ("createDriver" in db) {
    if (db instanceof SqliteDialect) return "sqlite";
    if (db instanceof MysqlDialect) return "mysql";
    if (db instanceof PostgresDialect) return "postgres";
    if (db instanceof MssqlDialect) return "mssql";
  }
  if ("aggregate" in db) return "sqlite";
  if ("getConnection" in db) return "mysql";
  if ("connect" in db) return "postgres";
  if ("fileControl" in db) return "sqlite";
  if ("open" in db && "close" in db && "prepare" in db) return "sqlite";
  if ("batch" in db && "exec" in db && "prepare" in db) return "sqlite";
  return null;
}
const createKyselyAdapter = async (config) => {
  const db = config.database;
  if (!db) return {
    kysely: null,
    databaseType: null,
    transaction: void 0
  };
  if ("db" in db) return {
    kysely: db.db,
    databaseType: db.type,
    transaction: db.transaction
  };
  if ("dialect" in db) return {
    kysely: new Kysely({ dialect: db.dialect }),
    databaseType: db.type,
    transaction: db.transaction
  };
  let dialect = void 0;
  const databaseType = getKyselyDatabaseType(db);
  if ("createDriver" in db) dialect = db;
  if ("aggregate" in db && !("createSession" in db)) dialect = new SqliteDialect({ database: db });
  if ("getConnection" in db) dialect = new MysqlDialect(db);
  if ("connect" in db) dialect = new PostgresDialect({ pool: db });
  if ("fileControl" in db) {
    const { BunSqliteDialect: BunSqliteDialect2 } = await Promise.resolve().then(function() {
      return bunSqliteDialectC8OaCWSL;
    });
    dialect = new BunSqliteDialect2({ database: db });
  }
  if ("createSession" in db) {
    let DatabaseSync = void 0;
    try {
      const nodeSqlite = "node:sqlite";
      ({ DatabaseSync } = await import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        nodeSqlite
      ));
    } catch (error) {
      if (error !== null && typeof error === "object" && "code" in error && error.code !== "ERR_UNKNOWN_BUILTIN_MODULE") throw error;
    }
    if (DatabaseSync && db instanceof DatabaseSync) {
      const { NodeSqliteDialect: NodeSqliteDialect2 } = await Promise.resolve().then(function() {
        return nodeSqliteDialect;
      });
      dialect = new NodeSqliteDialect2({ database: db });
    }
  }
  if ("batch" in db && "exec" in db && "prepare" in db) {
    const { D1SqliteDialect: D1SqliteDialect2 } = await Promise.resolve().then(function() {
      return d1SqliteDialectSYHNqBte;
    });
    dialect = new D1SqliteDialect2({ database: db });
  }
  return {
    kysely: dialect ? new Kysely({ dialect }) : null,
    databaseType,
    transaction: void 0
  };
};
const kyselyAdapter = (db, config) => {
  let lazyOptions = null;
  const createCustomAdapter = (db2) => {
    return ({ getFieldName, schema, getDefaultFieldName, getDefaultModelName, getFieldAttributes, getModelName }) => {
      const selectAllJoins = (join) => {
        const allSelects = [];
        const allSelectsStr = [];
        if (join) for (const [joinModel, _] of Object.entries(join)) {
          const fields = schema[getDefaultModelName(joinModel)]?.fields;
          const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
          if (!fields) continue;
          fields.id = { type: "string" };
          for (const [field, fieldAttr] of Object.entries(fields)) {
            allSelects.push(sql`${sql.ref(`join_${joinModelName}`)}.${sql.ref(fieldAttr.fieldName || field)} as ${sql.ref(`_joined_${joinModelName}_${fieldAttr.fieldName || field}`)}`);
            allSelectsStr.push({
              joinModel,
              joinModelRef: joinModelName,
              fieldName: fieldAttr.fieldName || field
            });
          }
        }
        return {
          allSelectsStr,
          allSelects
        };
      };
      const withReturning = async (values, builder, model, where) => {
        let res;
        if (config?.type === "mysql") {
          await builder.execute();
          const field = values.id ? "id" : where.length > 0 && where[0]?.field ? where[0].field : "id";
          if (!values.id && where.length === 0) {
            res = await db2.selectFrom(model).selectAll().orderBy(getFieldName({
              model,
              field
            }), "desc").limit(1).executeTakeFirst();
            return res;
          }
          const value = values[field] || where[0]?.value;
          res = await db2.selectFrom(model).selectAll().orderBy(getFieldName({
            model,
            field
          }), "desc").where(getFieldName({
            model,
            field
          }), "=", value).limit(1).executeTakeFirst();
          return res;
        }
        if (config?.type === "mssql") {
          res = await builder.outputAll("inserted").executeTakeFirst();
          return res;
        }
        res = await builder.returningAll().executeTakeFirst();
        return res;
      };
      function convertWhereClause(model, w) {
        if (!w) return {
          and: null,
          or: null
        };
        const conditions = {
          and: [],
          or: []
        };
        w.forEach((condition) => {
          const { field: _field, value: _value, operator = "=", connector = "AND" } = condition;
          const value = _value;
          const field = getFieldName({
            model,
            field: _field
          });
          const expr = (eb) => {
            const f = `${model}.${field}`;
            if (operator.toLowerCase() === "in") return eb(f, "in", Array.isArray(value) ? value : [value]);
            if (operator.toLowerCase() === "not_in") return eb(f, "not in", Array.isArray(value) ? value : [value]);
            if (operator === "contains") return eb(f, "like", `%${value}%`);
            if (operator === "starts_with") return eb(f, "like", `${value}%`);
            if (operator === "ends_with") return eb(f, "like", `%${value}`);
            if (operator === "eq") return eb(f, "=", value);
            if (operator === "ne") return eb(f, "<>", value);
            if (operator === "gt") return eb(f, ">", value);
            if (operator === "gte") return eb(f, ">=", value);
            if (operator === "lt") return eb(f, "<", value);
            if (operator === "lte") return eb(f, "<=", value);
            return eb(f, operator, value);
          };
          if (connector === "OR") conditions.or.push(expr);
          else conditions.and.push(expr);
        });
        return {
          and: conditions.and.length ? conditions.and : null,
          or: conditions.or.length ? conditions.or : null
        };
      }
      function processJoinedResults(rows, joinConfig, allSelectsStr) {
        if (!joinConfig || !rows.length) return rows;
        const groupedByMainId = /* @__PURE__ */ new Map();
        for (const currentRow of rows) {
          const mainModelFields = {};
          const joinedModelFields = {};
          for (const [joinModel] of Object.entries(joinConfig)) joinedModelFields[getModelName(joinModel)] = {};
          for (const [key, value] of Object.entries(currentRow)) {
            const keyStr = String(key);
            let assigned = false;
            for (const { joinModel, fieldName, joinModelRef } of allSelectsStr) if (keyStr === `_joined_${joinModelRef}_${fieldName}` || keyStr === `_Joined${capitalizeFirstLetter(joinModelRef)}${capitalizeFirstLetter(fieldName)}`) {
              joinedModelFields[getModelName(joinModel)][getFieldName({
                model: joinModel,
                field: fieldName
              })] = value;
              assigned = true;
              break;
            }
            if (!assigned) mainModelFields[key] = value;
          }
          const mainId = mainModelFields.id;
          if (!mainId) continue;
          if (!groupedByMainId.has(mainId)) {
            const entry2 = { ...mainModelFields };
            for (const [joinModel, joinAttr] of Object.entries(joinConfig)) entry2[getModelName(joinModel)] = joinAttr.relation === "one-to-one" ? null : [];
            groupedByMainId.set(mainId, entry2);
          }
          const entry = groupedByMainId.get(mainId);
          for (const [joinModel, joinAttr] of Object.entries(joinConfig)) {
            const isUnique = joinAttr.relation === "one-to-one";
            const limit = joinAttr.limit ?? 100;
            const joinedObj = joinedModelFields[getModelName(joinModel)];
            const hasData = joinedObj && Object.keys(joinedObj).length > 0 && Object.values(joinedObj).some((value) => value !== null && value !== void 0);
            if (isUnique) entry[getModelName(joinModel)] = hasData ? joinedObj : null;
            else {
              const joinModelName = getModelName(joinModel);
              if (Array.isArray(entry[joinModelName]) && hasData) {
                if (entry[joinModelName].length >= limit) continue;
                const idFieldName = getFieldName({
                  model: joinModel,
                  field: "id"
                });
                const joinedId = joinedObj[idFieldName];
                if (joinedId) {
                  if (!entry[joinModelName].some((item) => item[idFieldName] === joinedId) && entry[joinModelName].length < limit) entry[joinModelName].push(joinedObj);
                } else if (entry[joinModelName].length < limit) entry[joinModelName].push(joinedObj);
              }
            }
          }
        }
        const result = Array.from(groupedByMainId.values());
        for (const entry of result) for (const [joinModel, joinAttr] of Object.entries(joinConfig)) if (joinAttr.relation !== "one-to-one") {
          const joinModelName = getModelName(joinModel);
          if (Array.isArray(entry[joinModelName])) {
            const limit = joinAttr.limit ?? 100;
            if (entry[joinModelName].length > limit) entry[joinModelName] = entry[joinModelName].slice(0, limit);
          }
        }
        return result;
      }
      return {
        async create({ data, model }) {
          return await withReturning(data, db2.insertInto(model).values(data), model, []);
        },
        async findOne({ model, where, select, join }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.selectFrom((eb) => {
            let b = eb.selectFrom(model);
            if (and) b = b.where((eb2) => eb2.and(and.map((expr) => expr(eb2))));
            if (or) b = b.where((eb2) => eb2.or(or.map((expr) => expr(eb2))));
            if (select?.length && select.length > 0) b = b.select(select.map((field) => getFieldName({
              model,
              field
            })));
            else b = b.selectAll();
            return b.as("primary");
          }).selectAll("primary");
          if (join) for (const [joinModel, joinAttr] of Object.entries(join)) {
            const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
            query = query.leftJoin(`${joinModel} as join_${joinModelName}`, (join2) => join2.onRef(`join_${joinModelName}.${joinAttr.on.to}`, "=", `primary.${joinAttr.on.from}`));
          }
          const { allSelectsStr, allSelects } = selectAllJoins(join);
          query = query.select(allSelects);
          const res = await query.execute();
          if (!res || !Array.isArray(res) || res.length === 0) return null;
          const row = res[0];
          if (join) return processJoinedResults(res, join, allSelectsStr)[0];
          return row;
        },
        async findMany({ model, where, limit, select, offset, sortBy, join }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.selectFrom((eb) => {
            let b = eb.selectFrom(model);
            if (config?.type === "mssql") {
              if (offset !== void 0) {
                if (!sortBy) b = b.orderBy(getFieldName({
                  model,
                  field: "id"
                }));
                b = b.offset(offset).fetch(limit || 100);
              } else if (limit !== void 0) b = b.top(limit);
            } else {
              if (limit !== void 0) b = b.limit(limit);
              if (offset !== void 0) b = b.offset(offset);
            }
            if (sortBy?.field) b = b.orderBy(`${getFieldName({
              model,
              field: sortBy.field
            })}`, sortBy.direction);
            if (and) b = b.where((eb2) => eb2.and(and.map((expr) => expr(eb2))));
            if (or) b = b.where((eb2) => eb2.or(or.map((expr) => expr(eb2))));
            if (select?.length && select.length > 0) b = b.select(select.map((field) => getFieldName({
              model,
              field
            })));
            else b = b.selectAll();
            return b.as("primary");
          }).selectAll("primary");
          if (join) for (const [joinModel, joinAttr] of Object.entries(join)) {
            const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
            query = query.leftJoin(`${joinModel} as join_${joinModelName}`, (join2) => join2.onRef(`join_${joinModelName}.${joinAttr.on.to}`, "=", `primary.${joinAttr.on.from}`));
          }
          const { allSelectsStr, allSelects } = selectAllJoins(join);
          query = query.select(allSelects);
          if (sortBy?.field) query = query.orderBy(`${getFieldName({
            model,
            field: sortBy.field
          })}`, sortBy.direction);
          const res = await query.execute();
          if (!res) return [];
          if (join) return processJoinedResults(res, join, allSelectsStr);
          return res;
        },
        async update({ model, where, update: values }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.updateTable(model).set(values);
          if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
          if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
          return await withReturning(values, query, model, where);
        },
        async updateMany({ model, where, update: values }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.updateTable(model).set(values);
          if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
          if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
          const res = (await query.executeTakeFirst()).numUpdatedRows;
          return res > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Number(res);
        },
        async count({ model, where }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.selectFrom(model).select(db2.fn.count("id").as("count"));
          if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
          if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
          const res = await query.execute();
          if (typeof res[0].count === "number") return res[0].count;
          if (typeof res[0].count === "bigint") return Number(res[0].count);
          return parseInt(res[0].count);
        },
        async delete({ model, where }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.deleteFrom(model);
          if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
          if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
          await query.execute();
        },
        async deleteMany({ model, where }) {
          const { and, or } = convertWhereClause(model, where);
          let query = db2.deleteFrom(model);
          if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
          if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
          const res = (await query.executeTakeFirst()).numDeletedRows;
          return res > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Number(res);
        },
        options: config
      };
    };
  };
  let adapterOptions = null;
  adapterOptions = {
    config: {
      adapterId: "kysely",
      adapterName: "Kysely Adapter",
      usePlural: config?.usePlural,
      debugLogs: config?.debugLogs,
      supportsBooleans: config?.type === "sqlite" || config?.type === "mssql" || config?.type === "mysql" || !config?.type ? false : true,
      supportsDates: config?.type === "sqlite" || config?.type === "mssql" || !config?.type ? false : true,
      supportsJSON: config?.type === "postgres" ? true : false,
      supportsArrays: false,
      supportsUUIDs: config?.type === "postgres" ? true : false,
      transaction: config?.transaction ? (cb) => db.transaction().execute((trx) => {
        return cb(createAdapterFactory({
          config: adapterOptions.config,
          adapter: createCustomAdapter(trx)
        })(lazyOptions));
      }) : false
    },
    adapter: createCustomAdapter(db)
  };
  const adapter = createAdapterFactory(adapterOptions);
  return (options) => {
    lazyOptions = options;
    return adapter(options);
  };
};
var BunSqliteAdapter = class {
  get supportsCreateIfNotExists() {
    return true;
  }
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsReturning() {
    return true;
  }
  async acquireMigrationLock() {
  }
  async releaseMigrationLock() {
  }
  get supportsOutput() {
    return true;
  }
};
var BunSqliteDriver = class {
  #config;
  #connectionMutex = new ConnectionMutex$1();
  #db;
  #connection;
  constructor(config) {
    this.#config = { ...config };
  }
  async init() {
    this.#db = this.#config.database;
    this.#connection = new BunSqliteConnection(this.#db);
    if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
  }
  async acquireConnection() {
    await this.#connectionMutex.lock();
    return this.#connection;
  }
  async beginTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async releaseConnection() {
    this.#connectionMutex.unlock();
  }
  async destroy() {
    this.#db?.close();
  }
};
var BunSqliteConnection = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  executeQuery(compiledQuery) {
    const { sql: sql2, parameters } = compiledQuery;
    const stmt = this.#db.prepare(sql2);
    return Promise.resolve({ rows: stmt.all(parameters) });
  }
  async *streamQuery() {
    throw new Error("Streaming query is not supported by SQLite driver.");
  }
};
var ConnectionMutex$1 = class ConnectionMutex {
  #promise;
  #resolve;
  async lock() {
    while (this.#promise !== void 0) await this.#promise;
    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }
  unlock() {
    const resolve = this.#resolve;
    this.#promise = void 0;
    this.#resolve = void 0;
    resolve?.();
  }
};
var BunSqliteIntrospector = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    return Promise.all(tables.map(({ name }) => this.#getTableMetadata(name)));
  }
  async getMetadata(options) {
    return { tables: await this.getTables(options) };
  }
  async #getTableMetadata(table) {
    const db = this.#db;
    const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
    return {
      name: table,
      columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
        "name",
        "type",
        "notnull",
        "dflt_value"
      ]).execute()).map((col) => ({
        name: col.name,
        dataType: col.type,
        isNullable: !col.notnull,
        isAutoIncrementing: col.name === autoIncrementCol,
        hasDefaultValue: col.dflt_value != null
      })),
      isView: true
    };
  }
};
var BunSqliteQueryCompiler = class extends DefaultQueryCompiler {
  getCurrentParameterPlaceholder() {
    return "?";
  }
  getLeftIdentifierWrapper() {
    return '"';
  }
  getRightIdentifierWrapper() {
    return '"';
  }
  getAutoIncrement() {
    return "autoincrement";
  }
};
var BunSqliteDialect = class {
  #config;
  constructor(config) {
    this.#config = { ...config };
  }
  createDriver() {
    return new BunSqliteDriver(this.#config);
  }
  createQueryCompiler() {
    return new BunSqliteQueryCompiler();
  }
  createAdapter() {
    return new BunSqliteAdapter();
  }
  createIntrospector(db) {
    return new BunSqliteIntrospector(db);
  }
};
const bunSqliteDialectC8OaCWSL = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BunSqliteDialect
});
var NodeSqliteAdapter = class {
  get supportsCreateIfNotExists() {
    return true;
  }
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsReturning() {
    return true;
  }
  async acquireMigrationLock() {
  }
  async releaseMigrationLock() {
  }
  get supportsOutput() {
    return true;
  }
};
var NodeSqliteDriver = class {
  #config;
  #connectionMutex = new ConnectionMutex2();
  #db;
  #connection;
  constructor(config) {
    this.#config = { ...config };
  }
  async init() {
    this.#db = this.#config.database;
    this.#connection = new NodeSqliteConnection(this.#db);
    if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
  }
  async acquireConnection() {
    await this.#connectionMutex.lock();
    return this.#connection;
  }
  async beginTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async releaseConnection() {
    this.#connectionMutex.unlock();
  }
  async destroy() {
    this.#db?.close();
  }
};
var NodeSqliteConnection = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  executeQuery(compiledQuery) {
    const { sql: sql2, parameters } = compiledQuery;
    const rows = this.#db.prepare(sql2).all(...parameters);
    return Promise.resolve({ rows });
  }
  async *streamQuery() {
    throw new Error("Streaming query is not supported by SQLite driver.");
  }
};
var ConnectionMutex2 = class {
  #promise;
  #resolve;
  async lock() {
    while (this.#promise !== void 0) await this.#promise;
    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }
  unlock() {
    const resolve = this.#resolve;
    this.#promise = void 0;
    this.#resolve = void 0;
    resolve?.();
  }
};
var NodeSqliteIntrospector = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    return Promise.all(tables.map(({ name }) => this.#getTableMetadata(name)));
  }
  async getMetadata(options) {
    return { tables: await this.getTables(options) };
  }
  async #getTableMetadata(table) {
    const db = this.#db;
    const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
    return {
      name: table,
      columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
        "name",
        "type",
        "notnull",
        "dflt_value"
      ]).execute()).map((col) => ({
        name: col.name,
        dataType: col.type,
        isNullable: !col.notnull,
        isAutoIncrementing: col.name === autoIncrementCol,
        hasDefaultValue: col.dflt_value != null
      })),
      isView: true
    };
  }
};
var NodeSqliteQueryCompiler = class extends DefaultQueryCompiler {
  getCurrentParameterPlaceholder() {
    return "?";
  }
  getLeftIdentifierWrapper() {
    return '"';
  }
  getRightIdentifierWrapper() {
    return '"';
  }
  getAutoIncrement() {
    return "autoincrement";
  }
};
var NodeSqliteDialect = class {
  #config;
  constructor(config) {
    this.#config = { ...config };
  }
  createDriver() {
    return new NodeSqliteDriver(this.#config);
  }
  createQueryCompiler() {
    return new NodeSqliteQueryCompiler();
  }
  createAdapter() {
    return new NodeSqliteAdapter();
  }
  createIntrospector(db) {
    return new NodeSqliteIntrospector(db);
  }
};
const nodeSqliteDialect = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  NodeSqliteDialect
});
var D1SqliteAdapter = class extends SqliteAdapter {
};
var D1SqliteDriver = class {
  #config;
  #connection;
  constructor(config) {
    this.#config = { ...config };
  }
  async init() {
    this.#connection = new D1SqliteConnection(this.#config.database);
    if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
  }
  async acquireConnection() {
    return this.#connection;
  }
  async beginTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async commitTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async rollbackTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async releaseConnection() {
  }
  async destroy() {
  }
};
var D1SqliteConnection = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  async executeQuery(compiledQuery) {
    const results = await this.#db.prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
    const numAffectedRows = results.meta.changes != null ? BigInt(results.meta.changes) : void 0;
    return {
      insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
      rows: results?.results || [],
      numAffectedRows,
      numUpdatedOrDeletedRows: numAffectedRows
    };
  }
  async *streamQuery() {
    throw new Error("D1 does not support streaming queries.");
  }
};
var D1SqliteIntrospector = class {
  #db;
  #d1;
  constructor(db, d1) {
    this.#db = db;
    this.#d1 = d1;
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = this.#db.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
      "name",
      "type",
      "sql"
    ]).$castTo();
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    if (tables.length === 0) return [];
    const statements = tables.map((table) => this.#d1.prepare("SELECT * FROM pragma_table_info(?)").bind(table.name));
    const batchResults = await this.#d1.batch(statements);
    return tables.map((table, index) => {
      const columnInfo = batchResults[index]?.results ?? [];
      let autoIncrementCol = table.sql?.split(/[(),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.filter(Boolean)?.[0]?.replace(/["`]/g, "");
      if (!autoIncrementCol) {
        const pkCols = columnInfo.filter((r) => r.pk > 0);
        const singlePk = pkCols.length === 1 ? pkCols[0] : void 0;
        if (singlePk && singlePk.type.toLowerCase() === "integer") autoIncrementCol = singlePk.name;
      }
      return {
        name: table.name,
        isView: table.type === "view",
        columns: columnInfo.map((col) => ({
          name: col.name,
          dataType: col.type,
          isNullable: !col.notnull,
          isAutoIncrementing: col.name === autoIncrementCol,
          hasDefaultValue: col.dflt_value != null
        }))
      };
    });
  }
  async getMetadata(options) {
    return { tables: await this.getTables(options) };
  }
};
var D1SqliteQueryCompiler = class extends SqliteQueryCompiler {
};
var D1SqliteDialect = class {
  #config;
  constructor(config) {
    this.#config = { ...config };
  }
  createDriver() {
    return new D1SqliteDriver(this.#config);
  }
  createQueryCompiler() {
    return new D1SqliteQueryCompiler();
  }
  createAdapter() {
    return new D1SqliteAdapter();
  }
  createIntrospector(db) {
    return new D1SqliteIntrospector(db, this.#config.database);
  }
};
const d1SqliteDialectSYHNqBte = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  D1SqliteDialect
});
export {
  createKyselyAdapter as c,
  getKyselyDatabaseType as g,
  kyselyAdapter as k
};
