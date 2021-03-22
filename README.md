# Cadet Fractal

Adds an `a11y` panel to Fractal that runs AXE tests against the current component in the preview window.

## Installation

```
npm -i -D @bluecadet/cadet-frctl
```

In `fractal.config.js`, add the following lines:

```
const mandelbrot = require('@frctl/mandelbrot');
const theme = require('cadetfrctl')(mandelbrot);

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