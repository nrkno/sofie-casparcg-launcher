# Sofie: The Modern TV News Studio Automation System (launcher for the CasparCG Server process)

> Simple launcher for CasparCG

### Features
 * Presents log in a more readable format with lines coloured by severity
 * Builds as a single exe that can be dropped into existing casparcg folder
 * Allows for easy stopping and restarting of both casparcg and media-scanner
 * Option to pass through command line options to each executable
 * Basic http api to stop/start/restart each process remotely
 * Auto restart each process upon crashing or exiting

### Screenshots

![](doc/screenshot.png)

![](doc/settings.png)

### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build


# lint all JS/Vue component files in `src/`
yarn run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
