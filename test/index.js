var should = require('should');
var Palette = require('..');
var inspect = require('util').inspect;

describe('Palette', function() {
  it('basic', function() {
    var palette = new Palette({
      blue: 'hsla(150, 50%, 50%, 1)',
      red: 'hsla(0, 50%, 50%, 1)',
      _: {
        dark: '.darken(2)',
        light: '.lighten(2)'
      }
    });

    log(palette.toString());
  });

  it('reference', function() {
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

    log(palette.toString());
  });

  it('colors', function() {
    var palette = new Palette({
      _: {                          // default subcolors
        light: 'hsla(222, 22%, 22%, .222)',
        gray: 'rgb(100, 100, 100)', // a literal color value
        desaturated: '.dampen(4)',  // an interpretted color value
        faded: ['.soften(1)', {       // nested subcolors, which will
          saturated: '.brighten(1)',  // use `faded` as their naming context
          desaturated: '.dampen(1)',  // and `.soften(1)` as their value context
        }]
      },

      blue: '#22e',   // another literal color
      blue2: '@blue', // a reference to use the `blue` value defined above
      blue3: '@blue.darken(2)',  // references are also interpretted

      red: ['red'],  // a literal in an array with no subcolors is technically allowed
      red2: ['@red', {
        gray: '.dampen(2)',        // these overrides the `gray`
        desaturated: '.dampen(2)', // and `desaturated` subcolors in this context
        foo: '.h(1)',
        bar: '.s(.2)',          // you can add as many additional subcolors
        baz: '.l(.3)',          // for this context as you like
        qux: '.a(.4)'
      }],
      red3: ['@red.light', {
        one: ['@orange.light', {
          two: ['.light', {             // go as deep as you want
            three: '.damp',
            four: '@red3.one.two.three'  // referencing still works
          }]
        }]
      }],

      orange: ['orange', {
        light: 'hsla(111, 11%, 11%, .1111)'
      }]
    });

    log(palette.toString());
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
