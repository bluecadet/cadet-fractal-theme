# Cadet Fractal

Adds an `a11y` panel to Fractal that runs AXE tests against the current component in the preview window.

## Installation3

```
npm -i -D @bluecadet/cadetfrctl @frctl/mandelbrot
```

In `fractal.config.js`, add the following lines:

```
const mandelbrot = require('@frctl/mandelbrot');
const theme = require('@bluecadet/cadetfrctl')(mandelbrot);

fractal.web.theme(theme);
```

You can add options that you would normally pass to the `mandelbrot` theme by passing options in an object:

```
const mandelbrot = require('@frctl/mandelbrot');
const theme = require('cadetfrctl')(mandelbrot, {
  panels: ['html', 'a11y']
});

fractal.web.theme(theme);
```

## Known Violations in component config file

If a component has a violation that is not relevant to the context of the component (like a component that only contains an h3, for example), you can add the AXE violation id to a `knownViolations` array the config file:

```
// example.config.js

module.exports = {
  title: 'Example Component',
  context: {
    text: 'Hello World!'
  },
  knownViolations: [
    'landmark-one-main',
    'page-has-heading-one',
    'region'
  ]
}
```
