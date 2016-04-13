var Color = require('immutable-color');

module.exports = Palette;
module.exports['default'] = Palette;

var DOT_CODE = '.'.charCodeAt(0);
var AT_CODE = '@'.charCodeAt(0);

function Palette(colors){
  Object.defineProperties(this, {
    deferred: {
      value: {},
      writable: true
    },
    flat: {
      value: new Flat()
    },
    subcolors: {
      value: colors._
    }
  });

  delete colors._;
  for (var key in colors) {
    parseProp.call(this, [key], colors[key]);
  }

  while (true) {
    if (!Object.keys(this.deferred).length) break;
    for (var k in this.deferred) {
      if (this.deferred[k]()) delete this.deferred[k];
    }
  }

  for (var k in this) {
    if (this[k] && this[k].nested) delete this[k];
  }
}
Palette.prototype.toString = function() {
  return this.flat.toString();
};
Palette.prototype.toCamelCase = function() {
  return this.flat.toCamelCase();
};
Palette.prototype.toSnakeCase = function() {
  return this.flat.toSnakeCase();
};

function parseProp(keychain, color, context, depth) {
  depth = (depth || 0);
  context = context || this;

  var keystring = keychain.join('-');
  var value;
  var subcolors;

  if (typeof color === 'string') {
    value = color;
    subcolors = null;
  } else {
    value = color[0];
    subcolors = color[1];
  }

  if (!depth) {
    subcolors = Object.assign({}, this.subcolors, subcolors);
  }

  var resolved;
  var first = value.charCodeAt(0);

  if (first === DOT_CODE) {
    if (depth) {
      resolved = evaluate(value, context);
    } else {
      throw new Error('Cannot use dot at root level');
    }

  } else if (first === AT_CODE) {
    var parts = value.slice(1).split('.');
    var head = parts.shift();

    if (this[head]) {
      if (parts.length) {
        resolved = evaluate('.' + parts.join('.'), this[head]);
      } else {
        resolved = this[head];
      }
    } else {
      this.deferred[keystring] = parseProp.bind(this, keychain, color, context, depth);
    }

  } else {
    resolved = new Color(value, {mutable: true});
  }

  if (resolved) {
    var lastkey = keychain[keychain.length - 1];

    this[keystring] = resolved;
    this.flat.add(keystring, resolved);

    if (depth) Object.defineProperty(this[keystring], 'nested', {
      value: true
    });

    context = context[lastkey] = resolved;

    for (var subkey in subcolors) {
      context[subkey] = parseProp.call(this, keychain.concat(subkey), subcolors[subkey], context, depth + 1);
    }

    return context;
  }
}

function evaluate(str, context, tries) {
  tries = tries || 0;

  if (tries > 10) {
    throw new Error('Error parsing string "' + str + '" with ' + context.toString());
  }

  if (!(context instanceof Color)) {
    context = new Color(context, {mutable: true});
  }

  str = str.replace(/^\.([\w]*)(\([\.0-9]*\))?/gm, function(m, p1, p2, p3) {
    if (p1 && p2) context = context[p1](p2.slice(1, -1));
    else if (p1) context = context[p1];
    return '';
  });

  if (str.length) return evaluate(str, context, ++tries);

  return context;
}

function Flat() {}
Object.defineProperty(Flat.prototype, 'raw', {
  value: {},
  writable: true
});
Flat.prototype.add = function(key, value) {
  this[key] = value.toString();
  this.raw[key] = value;
};
Flat.prototype.toString = function(opts) {
  return JSON.stringify(this.to(), null, '  ');
};
Flat.prototype.toCamelCase = function(opts) {
  return this.to(toCamelCase, opts);
};
Flat.prototype.toSnakeCase = function(opts) {
  return this.to(toSnakeCase, opts);
};
Flat.prototype.to = function(fn, opts) {
  fn = fn || (x => x);
  opts = opts || {};
  var raw = opts.raw;
  var buf = {};
  for (var k in this) {
    if (!this.hasOwnProperty(k)) continue;
    buf[fn(k)] = (raw ? this.raw : this)[k];
  }
  return buf;
};

function toSnakeCase(str) {
  return str.replace(/-/g, '_');
}
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
}
