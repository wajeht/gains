import path from 'path';

class Email {
  static _map = {
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
          name: 'temporaryPassword',
          type: 'string',
        },
      ],
    },
  };

  static _validateInput(template, data) {
    const foundTemplate = this._map[template];
    const foundData = foundTemplate.data.map((cur) => cur.name);

    const gotData = Object.keys(data);
    // const b = Object.keys(x.data);

    console.log(a);
  }

  static send(template, data) {
    this._validateInput(template, data);
  }
}

const data = {
  username: 'jaw',
  verificationLink: 'https://localhost:8080/',
};

Email.send('verify-email', data);
