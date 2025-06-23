<p align="center">
<img width="70%" src="https://raw.githubusercontent.com/wajeht/gains/main/src/app/ui/assets/images/hero-new-half.png" />
</p>

> [!WARNING]
> **This codebase is no longer actively maintained.** The package will continue working, but support and changes are no longer provided.

# <p align="center">💪 Gains</p>

<div align="center">

[![Node.js CI](https://github.com/wajeht/gains/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/wajeht/gains/actions/workflows/deploy.yml) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/gains)

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
- **Vitest** for unit testing
- **Chart.js** for beautiful charts
- **[Animate.css](https://animate.style/)** for ready-made animation
- **Font-awesome** and **Bootstrap-icon** for icons
- **Command And Conquer (CAC)** for CLI
- **GitHub actions** for CI/CD
- **Caprover with Docker** for for zero config deployment
- **[AutoAnimate](https://auto-animate.formkit.com/)** for drop-in animation
- **Redis** to cache some of the large queries

# 👨‍💻 Getting started

Here below are some guides and docs to help set up your local development environment. Let us know if you have any questions!

- [Development guide](https://github.com/wajeht/gains/blob/main/docs/GETTING_STARTED.md)
- [Contribution guide](https://github.com/wajeht/gains/blob/main/docs/CONTRIBUTION.md)
- [Code of Conduct](https://github.com/wajeht/gains/blob/main/docs/CODE_OF_CONDUCT.md)

# 📐 Structure

A mono repo with express and vue app combined. Express will serve vue generated dist as static public content on '/' routes and serving '/api/v1/\*' for end-points.

for example:

```js
// api end-points
import v1 from '/app/api/v1/api.v1.js';
app.use("/api/v1", v1);

// vue app
app.get("*", (req, res) => {
  // index.html will be generated from vite as vue dist
  res.sendFile('src/app/public/index.html);
})
```

Take a look at the following tree structure for better understanding.

```bash
.github/
.vscode/
docs/
logs/
src/
├── app/
│   ├── api/      # main entry point for api end-points
│   │   ├── middlewares/
│   │   └── v1/
│   │       ├── user/             # mvc structure with component specific
│   │       │   ├── templates/    # email templates
│   │       │   │   └── happy-birthday.html
│   │       │   ├── user.controller.js
│   │       │   ├── user.model.js
│   │       │   ├── user.service.js
│   │       │   ├── user.router.js
│   │       │   └── user.test.js
│   │       ├── comment/
│   │       ├── auth/
│   │       ├── video/
│   │       └── api.v1.js
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
│   └── app.js
├── bin/
├── config/
├── public/   # serving vue app from express backend
├── crons/
├── tests/
├── utils/
├── package.json
├── vite.config.js
```

# © License

Distributed under the MIT License © wajeht. See [LICENSE](./LICENSE) for more information.

