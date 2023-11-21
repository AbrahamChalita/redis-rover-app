# REDIS ROVER

* The app is currently on the first stages of development. Right now it can only handle local connections. I plan to add:

- Console with command invoking functionality
- TTL management
- SSH tunneling
- Favorite connections

![imagen](https://github.com/AbrahamChalita/redis-rover-app/assets/54871116/f0d5bf93-8574-4aea-bd5a-4930fb0715c1)


## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/) -> v20.9.0
- You have installed [Yarn](https://yarnpkg.com/getting-started/install)
- You have installed [Rust](https://www.rust-lang.org/tools/install)
- You have a `<Windows/Linux/Mac>` 

## Installing redis-rover-app

To install redis-rover-app, follow these steps:

1. Clone the repo

2. Navigate into the project directory

```
cd redis-rover-app
```

3. Install dependencies

```
yarn install
```

4. To run as a web page:

```
yarn run dev
```

or to run the tauri app (this will allow connection to the backend on rust (also in the project))

```
yarn tauri dev
```

## Contact

If you want to contact me you can reach me at `<abrahamchalita@hotmail.com>`.

## License

To be determined



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
