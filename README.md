# sourcebit-source-sanity

[![npm version](https://badge.fury.io/js/sourcebit-source-sanity.svg)](https://badge.fury.io/js/sourcebit-source-sanity)

> A [Sanity](https://www.sanity.io) source plugin for [Sourcebit](https://github.com/stackbithq/sourcebit)

## 👩‍🏫 Introduction

With this plugin, you can add Sanity as a data source for Sourcebit. To connect your Contentful account, you need an [API token](https://www.sanity.io/docs/http-auth), your project ID and the name of your [dataset](https://www.sanity.io/docs/datasets).

## 🏗 Installation

To install the plugin and add it to your project, run:

```
npm install sourcebit-source-sanity --save
```

> 💡 You don't need to run this command if you start Sourcebit using the [interactive setup process](#%EF%B8%8F-interactive-setup-process), as the CLI will install the plugin for you and add it as a dependency to your project.

## ⚙️ Configuration

The plugin accepts the following configuration parameters. They can be supplied in any of the following ways:

- In the `options` object of the plugin configuration block inside `sourcebit.js`, with the value of the _Property_ column as a key;
- As an environment variable named after the _Env variable_ column, when running the `sourcebit fetch` command;
- As part of a `.env` file, with the value of the _Env variable_ column separated by the value with an equals sign (e.g. `MY_VARIABLE=my-value`);
- As a CLI parameter, when running the `sourcebit fetch` command, using the value of the _Parameter_ column as the name of the parameter (e.g. `sourcebit fetch --my-parameter`).

| Property          | Type    | Visibility  | Default value | Env variable          | Parameter | Description                                                            |
| ----------------- | ------- | ----------- | ------------- | --------------------- | --------- | ---------------------------------------------------------------------- |
| `accessToken`     | String  | **Private** |               | `SANITY_ACCESS_TOKEN` |           | The Sanity API token.                                                  |
| `dataset`         | String  | Public      |               |                       |           | The name of the [dataset](https://www.sanity.io/docs/datasets).        |
| `isPreview`       | Boolean | Public      | `false`       |                       |           | Whether to include draft/unpublished entries.                          |
| `query`           | String  | Public      | `"*[]"`       |                       |           | The query to pass to the Sanity API.                                   |
| `queryParameters` | Object  | Public      | `{}`          |                       |           | The query parameters to pass to the Sanity API.                        |
| `projectId`       | String  | Public      |               |                       |           | The ID of the Sanity project.                                          |
| `useCdn`          | Boolean | Public      | `false`       |                       |           | Whether to use the [Data API CDN](https://www.sanity.io/docs/api-cdn). |
| `watch`           | Boolean | Public      |               |                       | `watch`   | Whether to poll Contentful for content changes.                        |

### 👀 Example configuration

_sourcebit.js_

```js
module.exports = {
  plugins: [
    {
      module: require("sourcebit-source-sanity"),
      options: {
        accessToken: process.env["SANITY_ACCESS_TOKEN"],
        dataset: "production",
        projectId: "1q2w3e4r"
      }
    }
  ]
};
```

_.env_

```
SANITY_ACCESS_TOKEN=123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

### 🧞‍♂️ Interactive setup process

This plugin offers an interactive setup process via the `npx create-sourcebit` command.

## 📥 Input

_N/A_

## 📤 Output

This plugin adds normalized entries to the `objects` data bucket.
