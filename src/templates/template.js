import path from 'path';
import { isEqual, xor } from 'lodash-es';
import ejs from 'ejs';

export default class Template {
  /* A map of the templates that we have. */
  static _maps = {
    contact: {
      path: path.resolve(path.join(process.cwd(), 'src', 'templates', 'contact.html')),
      data: [
        {
          name: 'email',
          type: 'string',
        },
        {
          name: 'subject',
          type: 'string',
        },
        {
          name: 'message',
          type: 'string',
        },
      ],
    },
    'verify-email': {
      path: path.resolve(path.join(process.cwd(), 'src', 'templates', 'verify-email.html')),
      data: [
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'verificationLink',
          type: 'string',
        },
      ],
    },
    'forget-password': {
      path: path.resolve(path.join(process.cwd(), 'src', 'templates', 'forget-password.html')),
      data: [
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'passwordResetLink',
          type: 'string',
        },
      ],
    },
  };

  /**
   * _validateInput(template, data) checks to see if the template and data are valid
   * @param template - The template name you want to use.
   * @param data - This is the data that you want to pass into the template.
   */
  static _validateInput(template, data) {
    // check for template info within our maps
    const foundTemplateProperties = this._maps[template];
    if (!foundTemplateProperties) throw new Error('Invalid template!');
    const foundKeys = foundTemplateProperties.data.map((cur) => cur.name);

    // check to see if they are similar keys
    const gotKeys = Object.keys(data);
    const sameKeys = isEqual(foundKeys, gotKeys);
    // prettier-ignore
    if (!sameKeys) throw new Error(`Must pass in certain data for this template. '${xor(gotKeys, foundKeys)}' is missing. Available data are ${foundKeys.join(', ')}!`);

    // check to see the keys are similar data types
    const gotTypes = data;
    let foundTypes = {};
    foundTemplateProperties.data.forEach((cur) => (foundTypes[cur.name] = cur.type));

    for (const j in gotTypes) {
      const current = typeof gotTypes[j];
      if (foundTypes[j] !== current) {
        throw new Error(`Data types are not the same. ${j} should be typeof ${current}!`);
      }
    }
  }

  /**
   * It takes a template name and data, validates the input, and then uses the template name to find the
   * path to the template file, and then uses the data to render the template
   * @param template - The name of the template you want to use.
   * @param data - The data that will be used to populate the template.
   * @returns The rendered template.
   */
  static generate(template, data) {
    this._validateInput(template, data);
    const path = this._maps[template].path;
    let html = '';
    ejs.renderFile(path, data, (err, str) => {
      if (err) throw err;
      html = str;
    });
    return html;
  }
}

// const data = {
//   username: 'jaw',
//   // username: 9,
//   verificationLink: 'https://localhost:8080/',
// };
// Template.generate('verify-email', data);
