import path from 'path';
export default {
  info: {
    title: 'Gains',
    description: 'The best way to track your workouts',
    termsOfService: 'http://allkindsofgains.app/terms/',
    contact: {
      name: 'API Support',
      url: 'https://allkindsofgains.app/contact',
    },
    license: {
      name: 'GPL-V3.0',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
    version: '1.0.0',
  },
  baseDir: path.resolve(path.join(process.cwd(), 'src', 'apps', 'api')),
  filesPattern: ['./**/*.router.js', '*.js'],
  swaggerUIPath: '/docs/api',
  exposeSwaggerUI: true,
};
