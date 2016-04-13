# ui-kit-palette

Create precise, flexible color palettes with minimal effort.

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

### Unrealistic kitchen sink

```javascript
var Palette = require('ui-kit-palette');

var palette = new Palette({
  blue: 'hsl(150, 100%, 50%)',
  red: ['red', {
    lighter: '.lighten(.5).a(.5)'
  }],
  orange: ['@red', {
    redder: ['@red.lighter', {
      clearer: '@red.lighter.a(.25)',
      clearest: '@orange.redder.clearer.a(.1)'
    }]
  }],
  lime: '@green.light.dark.s(.5)',
  green: 'rgb(0, 100, 0)',
  primary: '@lime',
  secondary: ['@primary', {
    dark: '@primary.dark'
  }],
  _: {
    dark: '.dark',
    light: ['.light', {
      clear: '.soft'
    }]
  },
});
```

`palette.toString()` yields

```json
{
  "blue": "hsla(150, 100%, 50%, 1)",
  "blue-dark": "hsla(150, 100%, 35%, 1)",
  "blue-light": "hsla(150, 100%, 71.43%, 1)",
  "blue-light-clear": "hsla(150, 100%, 71.43%, 0.7)",
  "red": "hsla(0, 100%, 50%, 1)",
  "red-dark": "hsla(0, 100%, 35%, 1)",
  "red-light": "hsla(0, 100%, 71.43%, 1)",
  "red-light-clear": "hsla(0, 100%, 71.43%, 0.7)",
  "red-lighter": "hsla(0, 100%, 59.76%, 0.5)",
  "orange": "hsla(0, 100%, 50%, 1)",
  "orange-dark": "hsla(0, 100%, 35%, 1)",
  "orange-light": "hsla(0, 100%, 71.43%, 1)",
  "orange-light-clear": "hsla(0, 100%, 71.43%, 0.7)",
  "orange-redder": "hsla(0, 100%, 59.76%, 0.5)",
  "orange-redder-clearer": "hsla(0, 100%, 59.76%, 0.25)",
  "orange-redder-clearest": "hsla(0, 100%, 59.76%, 0.1)",
  "green": "hsla(120, 100%, 19.61%, 1)",
  "green-dark": "hsla(120, 100%, 13.73%, 1)",
  "green-light": "hsla(120, 100%, 28.01%, 1)",
  "green-light-clear": "hsla(120, 100%, 28.01%, 0.7)",
  "lime": "hsla(120, 50%, 19.61%, 1)",
  "lime-dark": "hsla(120, 50%, 13.73%, 1)",
  "lime-light": "hsla(120, 50%, 28.01%, 1)",
  "lime-light-clear": "hsla(120, 50%, 28.01%, 0.7)",
  "primary": "hsla(120, 50%, 19.61%, 1)",
  "primary-dark": "hsla(120, 50%, 13.73%, 1)",
  "primary-light": "hsla(120, 50%, 28.01%, 1)",
  "primary-light-clear": "hsla(120, 50%, 28.01%, 0.7)",
  "secondary": "hsla(120, 50%, 19.61%, 1)",
  "secondary-dark": "hsla(120, 50%, 13.73%, 1)",
  "secondary-light": "hsla(120, 50%, 28.01%, 1)",
  "secondary-light-clear": "hsla(120, 50%, 28.01%, 0.7)"
}
```

## Output formats

This library uses the `immutable-color` library to interpret and manipulate colors.
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

palette.red.darken(5).toString() // -> 'hsla(0, 100%, 50%, 1)'
```

The color values are stored in nested form on `palette`. Staying in our example,
`palette['red-light']` does not exist; to access that color value, either do

    palette.red.light

or

    palette.flat['red-light']

To emit the colors in a different key-delimited format, you can do

    palette.toCamelCase()

or

    palette.toSnakeCase()

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
}
```

This is pointless because the defined subcolors return what they would return anyway.
In this case, we can remove the subcolors and still get the same output.

```javascript
{
  red: 'red'
}
```

## License

MIT
