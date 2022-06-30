# 💪 Gains

[![Node.js CI](https://github.com/allkindsofgains/gains/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/allkindsofgains/gains/actions/workflows/deploy.yml) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/allkindsofgains/gains)

The best way to track your workouts

# 📚 Technologies

- **Node** with **Express** for API
- **PostgreSQL** for database
- **Knex** for database migration
- **Vue 3** with **Vite** tooling for UI
- **Pinia** for **Vue** state management
- **JWT** for stateless authentication
- **Bootstrap 5** for basic styling
- **Vitest** and **Cypress** for testing
- **Chart.js** for beautiful charts
- **[Hover.css](https://ianlunn.github.io/Hover/)** for button hover animation
- **[Type.js](https://github.com/mattboldt/typed.js/)** for text typewriter animation
- **[AOS.js](https://github.com/michalsnik/aos)** for animate on scroll animation
- **[AnimXYZ](https://animxyz.com/)** for core animation
- **Font-awesome** and **Bootstrap-icon** for icons
- **Command And Conquer (CAC)** for CLI

# 📐 Structure

A mono repo with express and vue app combined. Express will serve vue generated dist as static public content on '/' routes and serving '/api/v1/\*' for end-points.

for example:

```js
// api end-points
import v1 from '/app/api/v1/api.v1.ts';
app.use("/api/v1", v1);

// vue app
app.get("*", (req, res) => {
  // index.html will be generated from vite as vue dist
  res.sendFile('src/apps/public/index.html);
})
```

Take a look at the following tree structure for better understanding.

```bash
.github/
.vscode/
docs/
logs/
src/
├── apps/
│   ├── api/      # main entry point for api end-points
│   │   ├── middlewares/
│   │   └── v1/
│   │       ├── user/             # mvc structure with component specific
│   │       │   ├── templates/    # email templates
│   │       │   │   └── happy-birthday.html
│   │       │   ├── user.controller.ts
│   │       │   ├── user.model.ts
│   │       │   ├── user.service.ts
│   │       │   ├── user.router.ts
│   │       │   └── user.test.ts
│   │       ├── comment/
│   │       ├── auth/
│   │       ├── video/
│   │       └── api.v1.ts
│   ├── ui/       # main entry point for vue app
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── store/
│   │   ├── views/
│   │   ├── App.vue
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── vue.js
│   ├── cli/   # cli app with admin commands
│   └── app.ts
├── bin/
├── config/
├── public/   # serving vue app from express backend
├── crons/
├── tests/
├── utils/
├── package.json
├── vite.config.js
└── tsconfig.json
```

# © License

Distributed under the GNU GPL V3 License © wajeht. See LICENSE for more information.
