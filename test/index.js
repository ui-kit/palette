var should = require('should');
var Palette = require('..');
var inspect = require('util').inspect;

describe('Palette', function() {
  it('should handle basic configs', function() {
    var palette = new Palette({
      blue: 'hsla(150, 50%, 50%, 1)',
      red: 'hsla(0, 50%, 50%, 1)',
      _: {
        dark: '.darken(2)',
        light: '.lighten(2)'
      }
    });

    log(palette.toJSON());
  });

  it('should handle references, getters, and methods', function() {
    var palette = new Palette({
      _: {
        dark: '.dark',
        light: ['.light', {
          clear: '.soft'
        }]
      },
      'blue': 'hsl(150, 100%, 50%)',
      'red': ['red', {
        lighter: '.lighten(.5).a(.5)'
      }],
      'orange': ['@red', {
        redder: ['@red.lighter', {
          'clearer': '@red.lighter.a(.25)',
          'clearest': '@orange.redder.clearer.a(.75)'
        }]
      }],
      'lime': '@green.light.dark.s(.5)',
      'green': 'rgb(0, 100, 0)',
      'primary': '@lime',
      'secondary': ['@primary', {
        dark: '@primary.dark'
      }]
    });

    log(palette.toJSON());
  });

  it('should handle complex configs', function() {
    var palette = new Palette({
      _: {
        light: 'hsla(222, 22%, 22%, .222)',
        gray: 'rgb(100, 100, 100)',
        desaturated: '.dampen(4)',
        faded: ['.soften(1)', {
          saturated: '.brighten(1)',
          desaturated: '.dampen(1)',
        }]
      },

      blue: '#22e',
      blue2: '@blue',
      blue3: '@blue.darken(2)',

      red: ['red'],
      red2: ['@red', {
        gray: '.dampen(2)',
        desaturated: '.dampen(2)',
        foo: '.h(1)',
        bar: '.s(.2)',
        baz: '.l(.3)',
        qux: '.a(.4)'
      }],
      red3: ['@red.light', {
        one: ['@orange.light', {
          two: ['.light', {
            three: '.damp',
            four: '@red3.one.two.three'
          }]
        }]
      }],

      orange: ['orange', {
        light: 'hsla(111, 11%, 11%, .1111)'
      }]
    });

    log(palette.toJSON());
  });

  it('should format keys', function() {
    var palette = new Palette({
      red: 'red',
      blue: 'blue',
      _: {
        light: '.lightest'
      }
    });

    log(palette.toJSON({keys: 'dash'}));
    log(palette.toJSON({keys: 'snake'}));
    log(palette.toJSON({keys: 'pascal'}));
    log(palette.toJSON({keys: 'camel'}));
  });

  it('should extend', function() {
    var palette = new Palette({
      red: 'red',
      blue: 'blue',
      _: {
        light: '.light',
        lighter: '.lighter',
        lightest: '.lightest',
        dark: '.dark',
        darker: '.darker'
      }
    });

    log(palette.extend({
      red: {
        light: 'purple'
      },
      _: {
        light: 'orange',
        lighter: ['.lighter', {
          hard: '.soften(-1)'
        }],
        lightest: {
          soft: '.soft'
        },
        dark: [null]
      }
    }).toJSON());
  });
});

function log() {
  var opts = {color: true, depth: null};
  var args = [].slice.call(arguments).map(arg => {
    if (typeof arg === 'string') return arg;
    return inspect(arg, opts);
  });

  console.log.apply(console, args);
}
