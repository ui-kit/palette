/**
 * Module dependencies
 */

var Color = require('immutable-color');

/**
 * Character codes
 */

var DOT_CODE = '.'.charCodeAt(0);
var AT_CODE = '@'.charCodeAt(0);

/**
 * Define and expose `Palette`
 */

module.exports = Palette;
module.exports['default'] = Palette;

/**
 * Instantiates a palette based on `colors` configuration object
 * @param {Object} colors
 */
function Palette(colors){
  Object.defineProperties(this, {
    flat: {
      value: {},
      writable: true
    },
    deferred: {
      value: {},
      writable: true
    },
    subcolors: {
      value: colors._
    },
    colors: {
      value: Object.assign({}, colors)
    }
  });

  delete colors._;

  for (var key in colors) {
    parseProp.call(this, [key], colors[key], this, true);
  }

  while (true) {
    if (!Object.keys(this.deferred).length) break;
    for (var k in this.deferred) {
      if (this.deferred[k]()) delete this.deferred[k];
    }
  }
}

/**
 * Extend the colors in current palette and return new palette
 * @param {Object} colors
 */
Palette.prototype.extend = function(colors, context) {
  var buf = Object.assign({}, context || this.colors);

  for (var k in colors) {
    var color = colors[k];

    if (!color) continue;

    if (!buf[k] || typeof color === 'string') {
      buf[k] = color;
      continue;
    }

    if (k === '_') {
      buf[k] = this.extend(color, buf[k]);
      continue;
    }

    if (typeof buf[k] === 'string') {
      buf[k] = [buf[k], {}];
    }

    if (typeof color === 'string') {
      buf[k][0] = color;
      continue;
    }

    if (Array.isArray(color)) {
      buf[k][0] = color[0] || buf[k][0];
    } else {
      color = [null, color];
    }

    if (color[1]) {
      buf[k][1] = Object.assign({}, buf[k][1], color[1]);
    }
  }

  if (context) return buf;

  return new Palette(buf);
};

/**
 * @param {Object} opts
 */
Palette.prototype.print = function(opts) {
  opts = opts || {};

  var context = this;
  if (typeof opts.flat === 'undefined' ? true : !!opts.flat) context = context.flat;

  var keyFn = this.format.validate('key', opts.keys || 'dash');
  var valueFn = this.format.validate('value', opts.json ? 'string' : opts.values || 'raw');

  var prefix = opts.prefix || '';
  var suffix = opts.suffix || '';

  var buf = {}, key, val;
  for (var k in context) {
    if (!context.hasOwnProperty(k)) continue;
    key = keyFn(prefix + k + suffix);
    val = valueFn(context[k]);
    buf[key] = val;
  }

  return opts.json ? JSON.stringify(buf, null, '  ') : buf;
};

Palette.prototype.toString = function(opts) {
  return this.print(Object.assign({}, opts, {values: 'string'}));
};
Palette.prototype.toJSON = function(opts) {
  return this.print(Object.assign({}, opts, {json: true}));
};

Palette.prototype.format = {
  validate: function (type, string) {
    var fns = this.fns[type];
    var fn = fns[string];
    if (fn) return fn;
    var upper = type.charAt(0).toUpperCase() + type.slice(1);
    var keys = Object.keys(fns).map(x => '\'' + x + '\'').join(', ');
    throw new Error(upper + ' format \'' + string + '\' does not exit. Must be one of the following: ' + keys);
  },

  fns: {
    key: {
      camel: (str => str.replace(/-(\w)/g, (m, p1) => p1.toUpperCase())),
      pascal: (str => str.replace(/(\w)(\w*)-?/g, (m, p1, p2) => p1.toUpperCase() + p2)),
      snake: (str => str.replace(/-/g, '_')),
      dash: (x => x)
    },
    value: {
      string: (x => x.toString()),
      raw: (x => x)
    }
  }
};

function parseProp(keychain, color, context, isRoot) {
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

  if (isRoot) subcolors = Object.assign({}, this.subcolors, subcolors);

  var resolved;
  var first = value.charCodeAt(0);

  if (first === DOT_CODE) {
    if (isRoot) throw new Error('Cannot use dot at root level');
    resolved = evaluate(context, value);
  } else if (first === AT_CODE) {
    var parts = value.slice(1).split('.');
    var head = parts.shift();
    var stored = this.flat[head];

    if (stored) {
      if (parts.length) {
        resolved = evaluate(stored, '.' + parts.join('.'));
      } else {
        resolved = stored;
      }
    } else {
      this.deferred[keystring] = parseProp.bind(this, keychain, color, context, isRoot);
    }

  } else {
    resolved = new Color(value, {mutable: true});
  }

  if (!resolved) return;

  var lastkey = keychain[keychain.length - 1];

  if (isRoot) this[keystring] = resolved;

  this.flat[keystring] = resolved;
  context = context[lastkey] = resolved;

  for (var subkey in subcolors) {
    context[subkey] = parseProp.call(this, keychain.concat(subkey), subcolors[subkey], context, false);
  }

  return context;
}

function evaluate(context, str, tries) {
  tries = tries || 0;

  if (tries > 10) {
    throw new Error('Error parsing string "' + str + '" with ' + context.toString());
  }

  if (!(context instanceof Color)) {
    context = new Color(context, {mutable: true});
  }

  str = str.replace(/^\.([\w]*)(\(-?[\.0-9]*\))?/gm, function(m, p1, p2, p3) {
    if (p1 && p2) {
      if (context[p1] && context[p1] instanceof Color) {
        var prefix = p1.replace(/(er|est)$/);
        throw new Error(`'${p1}' is a getter. Do not call it like a function. Try '${prefix}en' instead.`);
      }
      if (typeof context[p1] !== 'function') {
        var funcs = Object.keys(Color.prototype).map(x => `'${x}'`).join(', ');
        throw new Error(`'${p1}' is is not a function. Try one of the following: ${funcs}`);
      }
      context = context[p1](p2.slice(1, -1));
    }
    else if (p1) context = context[p1];
    return '';
  });

  if (str.length) return evaluate(context, str, ++tries);

  return context;
}
