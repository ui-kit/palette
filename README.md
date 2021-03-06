# ui-kit-palette

Create precise, flexible color palettes with minimal effort.

## Installation

```sh
npm i ui-kit-palette
```

## Examples

### Basic

```javascript
var palette = new Palette({
  blue: 'hsla(150, 50%, 50%, 1)',
  red: 'hsla(0, 50%, 50%, 1)',
  _: {
    dark: '.darken(2)',
    light: '.lighten(2)'
  }
});
```

`palette.toString()` yields

```json
{
  "blue": "hsla(150, 50%, 50%, 1)",
  "blue-dark": "hsla(150, 50%, 24.5%, 1)",
  "blue-light": "hsla(150, 50%, 100%, 1)",

  "red": "hsla(0, 50%, 50%, 1)",
  "red-dark": "hsla(0, 50%, 24.5%, 1)",
  "red-light": "hsla(0, 50%, 100%, 1)"
}
```

### Annotated

```javascript
var palette = new Palette({
  _: {                          // default subcolors
    gray: 'rgb(100, 100, 100)', // a literal color value
    desaturated: '.dampen(4)',  // an interpretted color value
    faded: ['.soften(1)', {        // nested subcolors, which will
      saturated: '.brighten(1)',   // use `faded` as their naming context
      desaturated: '.dampen(1)',   // and `.soften(1)` as their value context
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
  red3: ['@red', {
    one: ['.dark', {
      two: ['.light', {             // go as deep as you want
        three: '.damp',
        four: '@red3.one.two.three'  // referencing still works
      }]
    }]
  }]
});
```

`palette.toString()` yields

```json
{
  "blue": "hsla(240, 85.71%, 53.33%, 1)",
  "blue-gray": "hsla(0, 0%, 39.22%, 1)",
  "blue-desaturated": "hsla(240, 20.58%, 53.33%, 1)",
  "blue-faded": "hsla(240, 85.71%, 53.33%, 0.7)",
  "blue-faded-saturated": "hsla(240, 100%, 53.33%, 0.7)",
  "blue-faded-desaturated": "hsla(240, 60%, 53.33%, 0.7)",

  "blue2": "hsla(240, 85.71%, 53.33%, 1)",
  "blue2-gray": "hsla(0, 0%, 39.22%, 1)",
  "blue2-desaturated": "hsla(240, 20.58%, 53.33%, 1)",
  "blue2-faded": "hsla(240, 85.71%, 53.33%, 0.7)",
  "blue2-faded-saturated": "hsla(240, 100%, 53.33%, 0.7)",
  "blue2-faded-desaturated": "hsla(240, 60%, 53.33%, 0.7)",

  "blue3": "hsla(240, 85.71%, 26.13%, 1)",
  "blue3-gray": "hsla(0, 0%, 39.22%, 1)",
  "blue3-desaturated": "hsla(240, 20.58%, 26.13%, 1)",
  "blue3-faded": "hsla(240, 85.71%, 26.13%, 0.7)",
  "blue3-faded-saturated": "hsla(240, 100%, 26.13%, 0.7)",
  "blue3-faded-desaturated": "hsla(240, 60%, 26.13%, 0.7)",

  "red": "hsla(0, 100%, 50%, 1)",
  "red-gray": "hsla(0, 0%, 39.22%, 1)",
  "red-desaturated": "hsla(0, 24.01%, 50%, 1)",
  "red-faded": "hsla(0, 100%, 50%, 0.7)",
  "red-faded-saturated": "hsla(0, 100%, 50%, 0.7)",
  "red-faded-desaturated": "hsla(0, 70%, 50%, 0.7)",

  "red2": "hsla(0, 100%, 50%, 1)",
  "red2-gray": "hsla(0, 49%, 50%, 1)",
  "red2-desaturated": "hsla(0, 49%, 50%, 1)",
  "red2-faded": "hsla(0, 100%, 50%, 0.7)",
  "red2-faded-saturated": "hsla(0, 100%, 50%, 0.7)",
  "red2-faded-desaturated": "hsla(0, 70%, 50%, 0.7)",
  "red2-foo": "hsla(1, 100%, 50%, 1)",
  "red2-bar": "hsla(0, 20%, 50%, 1)",
  "red2-baz": "hsla(0, 100%, 30%, 1)",
  "red2-qux": "hsla(0, 100%, 50%, 0.4)",

  "red3": "hsla(0, 100%, 50%, 1)",
  "red3-gray": "hsla(0, 0%, 39.22%, 1)",
  "red3-desaturated": "hsla(0, 24.01%, 50%, 1)",
  "red3-faded": "hsla(0, 100%, 50%, 0.7)",
  "red3-faded-saturated": "hsla(0, 100%, 50%, 0.7)",
  "red3-faded-desaturated": "hsla(0, 70%, 50%, 0.7)",
  "red3-one": "hsla(0, 100%, 35%, 1)",
  "red3-one-two": "hsla(0, 100%, 50%, 1)",
  "red3-one-two-three": "hsla(0, 70%, 50%, 1)",
  "red3-one-two-four": "hsla(0, 70%, 50%, 1)"
}
```

## Extending

Use the `extend` method to build on an existing palette. This method does not mutate the original palette.

```javascript
var palette = new Palette({
  red: 'red',
  blue: 'blue',
  _: {
    light: '.light',
    lighter: '.lighter',
    lightest: '.lightest',
    dark: '.dark'
  }
});

var newPalette = palette.extend({
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
});
```

`newPalette.toString()` yields

```javascript
{
  "red": "hsla(0, 100%, 50%, 1)",
  "red-light": "hsla(300, 100%, 25.1%, 1)",
  "red-lighter": "hsla(0, 100%, 100%, 1)",
  "red-lighter-hard": "hsla(0, 100%, 100%, 1)",
  "red-lightest": "hsla(0, 100%, 100%, 1)",
  "red-lightest-soft": "hsla(0, 100%, 100%, 0.7)",
  "red-dark": "hsla(0, 100%, 35%, 1)",

  "blue": "hsla(240, 100%, 50%, 1)",
  "blue-light": "hsla(38.82352941176471, 100%, 50%, 1)",
  "blue-lighter": "hsla(240, 100%, 100%, 1)",
  "blue-lighter-hard": "hsla(240, 100%, 100%, 1)",
  "blue-lightest": "hsla(240, 100%, 100%, 1)",
  "blue-lightest-soft": "hsla(240, 100%, 100%, 0.7)",
  "blue-dark": "hsla(240, 100%, 35%, 1)"
}
```

## Output formats

This library uses the [`immutable-color`](https://github.com/css-utils/immutable-color) library to interpret and manipulate colors.
These colors are stored and used for each color context.

An instance of `Palette` still has the color instances accessible, so you can operate
on them or use them for other purposes if you want.

```javascript
var palette = new Palette({
  red: 'red',
  blue: 'blue',
  _: {
    light: '.lightest'
  }
});

palette.red.darken(5).toString() // -> 'hsla(0, 100%, 8.4%, 1)'
```

The color values are stored in nested form on `palette`. Use the `print` method
to output various formats.

`print` takes a single argument, an object with the following properties:

* `keys` `{String}`: the color key format. Options: `string`, `raw`. Default: `string`
* `values` `{String}`: the color value format. Options: `dash`, `camel`, `pascal`, `snake`. Default: `dash`
* `json` `{Boolean}`: output a JSON string. Default: `false`
* `flat` `{Boolean}`: include subcolors. Default: `true`

You can also use one of the other sugary convenience methods `toString` or `toJSON` as seen in the examples below.

```javascript
palette.print({values: 'string'});
// or
palette.toString();
{
  red: 'hsla(0, 100%, 50%, 1)',
  'red-light': 'hsla(0, 100%, 100%, 1)',
  blue: 'hsla(240, 100%, 50%, 1)',
  'blue-light': 'hsla(240, 100%, 100%, 1)'
};
```

```javascript
palette.print({json: true});
// or
palette.toJSON();
`{
  "red": "hsla(0, 100%, 50%, 1)",
  "red-light": "hsla(0, 100%, 100%, 1)",
  "blue": "hsla(240, 100%, 50%, 1)",
  "blue-light": "hsla(240, 100%, 100%, 1)"
}`;
```

You can still pass `print` options to the convenience methods.

```javascript
palette.toString({keys: 'snake'});
{
  red: 'hsla(0, 100%, 50%, 1)',
  red_light: 'hsla(0, 100%, 100%, 1)',
  blue: 'hsla(240, 100%, 50%, 1)',
  blue_light: 'hsla(240, 100%, 100%, 1)'
};
```

## Notes

It should be noted that the purpose of this library is twofold:

1. To generate palettes to be transfered/stored as JSON

2. To extend a set of colors and make exceptions to the default values they return
by the `immutable-color` library. But if a subcolor in your palette does not deviate from
what `immutable-color` would return for that named getter, you don't need to define it.

For example, if you're using the palette in javascript (ie, *not* transfering/storing
it as JSON), the following configuration's subcolors are pointless:

```javascript
{
  red: ['red', {
    light: '.light',
    lighter: '.lighter',
    lightest: '.lightest'
  }
};
```

This is pointless because the defined subcolors return what they would return anyway.
In this case, we can remove the subcolors and still get the same output.

```javascript
{
  red: 'red'
};
```

## License

MIT
