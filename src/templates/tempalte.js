import ejs from 'ejs';

const html = ejs.renderFile('./verify-email.html', {
  username: 'jaw',
  verificationLink: 'https://www.allkindsofgains.app/',
});

console.log(html);
