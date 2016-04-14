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
    parseProp.call(this, [key], colors[key], this, 0);
  }

  while (true) {
    if (!Object.keys(this.deferred).length) break;
    for (var k in this.deferred) {
      if (this.deferred[k]()) delete this.deferred[k];
    }
  }
}
Palette.prototype.print = function(opts) {
  return this.flat.print(opts);
};
Palette.prototype.toString = function(opts) {
  return this.flat.toString(opts);
};
Palette.prototype.toCamelCase = function(opts) {
  return this.flat.toCamelCase(opts);
};
Palette.prototype.toSnakeCase = function(opts) {
  return this.flat.toSnakeCase(opts);
};

function parseProp(keychain, color, context, depth) {
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
      resolved = evaluate(context, value);
    } else {
      throw new Error('Cannot use dot at root level');
    }

  } else if (first === AT_CODE) {
    var parts = value.slice(1).split('.');
    var head = parts.shift();
    var stored = this.flat.raw[head];

    if (stored) {
      if (parts.length) {
        resolved = evaluate(stored, '.' + parts.join('.'));
      } else {
        resolved = stored;
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

    context = context[lastkey] = resolved;

    for (var subkey in subcolors) {
      context[subkey] = parseProp.call(this, keychain.concat(subkey), subcolors[subkey], context, depth + 1);
    }

    return context;
  }
}

function evaluate(context, str, tries) {
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

  if (str.length) return evaluate(context, str, ++tries);

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
Flat.prototype.print = function(opts) {
  return this.to(null, opts);
};
Flat.prototype.toString = function(opts) {
  return JSON.stringify(this.print(opts), null, '  ');
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
  var prefix = opts.prefix || '';
  var suffix = opts.suffix || '';
  var raw = opts.raw;
  var buf = {};
  for (var k in this) {
    if (!this.hasOwnProperty(k)) continue;
    buf[fn(prefix + k + suffix)] = (raw ? this.raw : this)[k];
  }
  return buf;
};

function toSnakeCase(str) {
  return str.replace(/-/g, '_');
}
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
}
