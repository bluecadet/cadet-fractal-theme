const _ = require('lodash');

module.exports = function(mandelbrot, options = {}) {

  const defaultStyles = ['default', '/cadetfrctl/axe.css'];

  const defaultConfig = {
    skin: 'default',
    rtl: false,
    lang: 'en',
    styles: defaultStyles,
    highlightStyles: 'default',
    scripts: 'default',
    format: 'json',
    static: {
        mount: 'themes/mandelbrot',
    },
    favicon: null,
    labels: {
        info: 'Information',
        builtOn: 'Built on',
        search: {
            label: 'Search',
            placeholder: 'Search…',
            clear: 'Clear search',
        },
        navigation: {
            back: 'Back',
        },
        tree: {
            collapse: 'Collapse tree',
        },
        components: {
            handle: 'Handle',
            tags: 'Tags',
            variants: 'Variants',
            context: {
                empty: 'No context defined.',
            },
            notes: {
                empty: 'No notes defined.',
            },
            preview: {
                label: 'Preview',
                withLayout: 'With layout',
                componentOnly: 'Component only',
            },
            path: 'Filesystem Path',
            references: 'References',
            referenced: 'Referenced by',
            resources: {
                file: 'File',
                content: 'Content',
                previewUnavailable: 'Previews are currently not available for this file type.',
                url: 'URL',
                path: 'Filesystem Path',
                size: 'Size',
            },
        },
        panels: {
            html: 'HTML',
            view: 'View',
            context: 'Context',
            resources: 'Resources',
            info: 'Info',
            notes: 'Notes',
            a11y: 'A11y'
        },
    },
    panels: [
      'html',
      'view',
      'context',
      'resources',
      'info',
      'notes',
      'a11y'
    ],
  };

  const config = Object.assign(defaultConfig, options);

  if ( config.styles ) {
    if ( Array.isArray(config.styles) ) {
      if ( !config.styles.includes('/cadetfrctl/axe.css')) {
        config.styles.push('/cadetfrctl/axe.css');
      }
    } else {
      config.styles = [config.styles, '/cadetfrctl/axe.css'];
    }
  } else {
    config.styles = defaultStyles;
  }

  const subTheme = mandelbrot(config);
  subTheme.addLoadPath(__dirname + '/views');
  subTheme.addStatic(__dirname + '/assets', '/cadetfrctl');

  subTheme.on('init', function (env, app) {
    require('./lib/filters')(subTheme, env, app);
    // console.log(env);
  });

  return subTheme
}
