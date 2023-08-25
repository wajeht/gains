import path from 'path';

export default {
  info: {
    title: 'Gains',
    description: 'The best way to track your workouts',
    termsOfService: 'http://gains.jaw.dev/terms/',
    contact: {
      name: 'API Support',
      url: 'https://gains.jaw.dev/contact',
    },
    license: {
      name: 'GPL-V3.0',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
    version: '1.0.0',
  },
  baseDir: path.resolve(path.join(process.cwd(), 'src', 'app')),
  filesPattern: ['./**/*.router.js', '*.js', './**/*.routes.js', 'app.js'],
  swaggerUIPath: '/docs/api',
  exposeSwaggerUI: true,
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: {},
};
