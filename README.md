<p align="center">
<img width="70%" src="https://raw.githubusercontent.com/allkindsofgains/gains/main/src/apps/ui/assets/images/hero-new-half.png" />
</p>

# <p align="center">💪 Gains</p>

<div align="center">

[![Node.js CI](https://github.com/allkindsofgains/gains/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/allkindsofgains/gains/actions/workflows/deploy.yml) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/allkindsofgains/gains)
</div>

<p align="center">All in one tools to help strength athletes load the right amount of training dosage!</p>

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
- ~~**[Hover.css](https://ianlunn.github.io/Hover/)** for button hover animation~~
- **[Type.js](https://github.com/mattboldt/typed.js/)** for text typewriter animation
- ~~**[AOS.js](https://github.com/michalsnik/aos)** for animate on scroll animation~~
- ~~**[AnimXYZ](https://animxyz.com/)** for specialized animation~~
- **[Animate.css](https://animate.style/)** for ready-made animation
- **Font-awesome** and **Bootstrap-icon** for icons
- **Command And Conquer (CAC)** for CLI
- **GitHub actions** for CI/CD
- **Caprover with Docker** for for zero config deployment
- **[AutoAnimate](https://auto-animate.formkit.com/)** for drop-in animation
- **Redis** to cache some of the large queries


# 👨‍💻 Getting started

Here below are some guides and docs to help set up your local development environment. Let us know if you have any questions!

- [Development guide](https://github.com/allkindsofgains/gains/blob/main/docs/GETTING_STARTED.md)
- [Contribution guide](https://github.com/allkindsofgains/gains/blob/main/docs/CONTRIBUTION.md)
- [Code of Conduct](https://github.com/allkindsofgains/gains/blob/main/docs/CODE_OF_CONDUCT.md)

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
