# 2026-sohd_storyboard

**Live demo** https://unctad-infovis.github.io/2026-sohd_storyboard/

## About

Disruptions in the Strait of Hormuz are sending shockwaves through the global energy system, driving up oil and food prices and placing an outsized burden on vulnerable economies. This project is a scrollytelling minisite, "Strait of Hormuz Disruptions: the burden of oil price shocks on vulnerable economies," walking readers through the crisis via ten narrative slides.

The page combines a header, animated on-scroll text, charts, and a globe visualisation across ten slides with slide navigation, sharing controls, and a footer linking to the full report. Content is rendered as a standalone React application embeddable within UNCTAD's Drupal platform.

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-sohd_storyboard/js/2026-sohd_storyboard.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-sohd_storyboard/css/2026-sohd_storyboard.min.css?v=1">
<div class="app-root-2026-sohd_storyboard" id="app-root-2026-sohd_storyboard">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to match the current build version to bust the cache.

## Used in

* [Strait of Hormuz Disruptions: the burden of oil price shocks on vulnerable economies](https://unctad.org/publication/strait-hormuz-disruptions-burden-oil-price-shocks-vulnerable-economies)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

## Packages

The following packages are used in this project by default.

### Project specific

* **d3** — used to create charts
* **topojson-client** — used to read topojson files

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components