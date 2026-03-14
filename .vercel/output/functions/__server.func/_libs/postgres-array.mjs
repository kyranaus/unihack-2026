var postgresArray$1 = {};
var hasRequiredPostgresArray$1;
function requirePostgresArray$1() {
  if (hasRequiredPostgresArray$1) return postgresArray$1;
  hasRequiredPostgresArray$1 = 1;
  postgresArray$1.parse = function(source, transform) {
    return new ArrayParser(source, transform).parse();
  };
  class ArrayParser {
    constructor(source, transform) {
      this.source = source;
      this.transform = transform || identity;
      this.position = 0;
      this.entries = [];
      this.recorded = [];
      this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var character = this.source[this.position++];
      if (character === "\\") {
        return {
          value: this.source[this.position++],
          escaped: true
        };
      }
      return {
        value: character,
        escaped: false
      };
    }
    record(character) {
      this.recorded.push(character);
    }
    newEntry(includeEmpty) {
      var entry;
      if (this.recorded.length > 0 || includeEmpty) {
        entry = this.recorded.join("");
        if (entry === "NULL" && !includeEmpty) {
          entry = null;
        }
        if (entry !== null) entry = this.transform(entry);
        this.entries.push(entry);
        this.recorded = [];
      }
    }
    consumeDimensions() {
      if (this.source[0] === "[") {
        while (!this.isEof()) {
          var char = this.nextCharacter();
          if (char.value === "=") break;
        }
      }
    }
    parse(nested) {
      var character, parser, quote;
      this.consumeDimensions();
      while (!this.isEof()) {
        character = this.nextCharacter();
        if (character.value === "{" && !quote) {
          this.dimension++;
          if (this.dimension > 1) {
            parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
            this.entries.push(parser.parse(true));
            this.position += parser.position - 2;
          }
        } else if (character.value === "}" && !quote) {
          this.dimension--;
          if (!this.dimension) {
            this.newEntry();
            if (nested) return this.entries;
          }
        } else if (character.value === '"' && !character.escaped) {
          if (quote) this.newEntry(true);
          quote = !quote;
        } else if (character.value === "," && !quote) {
          this.newEntry();
        } else {
          this.record(character.value);
        }
      }
      if (this.dimension !== 0) {
        throw new Error("array dimension not balanced");
      }
      return this.entries;
    }
  }
  function identity(value) {
    return value;
  }
  return postgresArray$1;
}
var postgresArray = {};
var hasRequiredPostgresArray;
function requirePostgresArray() {
  if (hasRequiredPostgresArray) return postgresArray;
  hasRequiredPostgresArray = 1;
  const BACKSLASH = "\\";
  const DQUOT = '"';
  const LBRACE = "{";
  const RBRACE = "}";
  const LBRACKET = "[";
  const EQUALS = "=";
  const COMMA = ",";
  const NULL_STRING = "NULL";
  function makeParseArrayWithTransform(transform) {
    const haveTransform = transform != null;
    return function parseArray2(str) {
      const rbraceIndex = str.length - 1;
      if (rbraceIndex === 1) {
        return [];
      }
      if (str[rbraceIndex] !== RBRACE) {
        throw new Error("Invalid array text - must end with }");
      }
      let position = 0;
      if (str[position] === LBRACKET) {
        position = str.indexOf(EQUALS) + 1;
      }
      if (str[position++] !== LBRACE) {
        throw new Error("Invalid array text - must start with {");
      }
      const output = [];
      let current = output;
      const stack = [];
      let currentStringStart = position;
      let currentString = "";
      let expectValue = true;
      for (; position < rbraceIndex; ++position) {
        let char = str[position];
        if (char === DQUOT) {
          currentStringStart = ++position;
          let dquot = str.indexOf(DQUOT, currentStringStart);
          let backSlash = str.indexOf(BACKSLASH, currentStringStart);
          while (backSlash !== -1 && backSlash < dquot) {
            position = backSlash;
            const part2 = str.slice(currentStringStart, position);
            currentString += part2;
            currentStringStart = ++position;
            if (dquot === position++) {
              dquot = str.indexOf(DQUOT, position);
            }
            backSlash = str.indexOf(BACKSLASH, position);
          }
          position = dquot;
          const part = str.slice(currentStringStart, position);
          currentString += part;
          current.push(haveTransform ? transform(currentString) : currentString);
          currentString = "";
          expectValue = false;
        } else if (char === LBRACE) {
          const newArray = [];
          current.push(newArray);
          stack.push(current);
          current = newArray;
          currentStringStart = position + 1;
          expectValue = true;
        } else if (char === COMMA) {
          expectValue = true;
        } else if (char === RBRACE) {
          expectValue = false;
          const arr = stack.pop();
          if (arr === void 0) {
            throw new Error("Invalid array text - too many '}'");
          }
          current = arr;
        } else if (expectValue) {
          currentStringStart = position;
          while ((char = str[position]) !== COMMA && char !== RBRACE && position < rbraceIndex) {
            ++position;
          }
          const part = str.slice(currentStringStart, position--);
          current.push(
            part === NULL_STRING ? null : haveTransform ? transform(part) : part
          );
          expectValue = false;
        } else {
          throw new Error("Was expecting delimeter");
        }
      }
      return output;
    };
  }
  const parseArray = makeParseArrayWithTransform();
  postgresArray.parse = (source, transform) => transform != null ? makeParseArrayWithTransform(transform)(source) : parseArray(source);
  return postgresArray;
}
var postgresArrayExports = /* @__PURE__ */ requirePostgresArray();
export {
  postgresArrayExports as p,
  requirePostgresArray$1 as r
};
