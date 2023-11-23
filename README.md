<img src="./readme/logo.png" />

基于 JSDoc3 的 **javascript** / **typescript** 项目的文档工具箱，带有 **@category**、**@component** 和 **@optional** 插件。

它长这样：

<table>
  <tr>
    <td>
      <a href='./readme/class.png'><img src="./readme/class.png" style="width: 300px"/></a>
    </td>
    <td>
      <a href='./readme/with-mermaid.png'><img src="./readme/with-mermaid.png" style="width: 300px"/></a>
    </td>
    <td>
      <a href='./readme/component.png'><img src="./readme/component.png" style="width: 300px"/></a>
    </td>
  </tr>
</table>

由于原版的一些 js 和 css 通过国外 CDN 加载，导致加载速度较慢，所以我将其改为本地加载。 

# 示例

示例文档可在此处找到: https://softwarebrothers.github.io/example-design-system/index.html

# 开源社区 SoftwareBrothers

- [加入社区](https://join.slack.com/t/adminbro/shared_invite/zt-czfb79t1-0U7pn_KCqd5Ts~lbJK0_RA) 以获得帮助并获得灵感。
- [订阅我们的邮件列表](http://opensource.softwarebrothers.co)

# 安装

```sh
npm install --save-dev better-docs-zh
```

# 主题用法

## 使用命令行

假设你已经全局安装了 [jsdoc](https://github.com/jsdoc/jsdoc):

```sh
jsdoc your-documented-file.js -t ./node_modules/better-docs-zh
```

## 使用 npm 和配置文件

在你项目中的 package.json 文件，添加一个新脚本：

``` json
"script": {
  "docs": "jsdoc -c jsdoc.json"
}
```

在你的 `jsdoc.json` 文件中，设置模板：

```json
"opts": {
  "template": "node_modules/better-docs-zh"
}
```

# TypeScript 支持

better-docs 有一个插件，允许您从 TypeScript 代码生成文档。

## 用法

更新您的 `jsdoc.json` 文件：

```json
...
"tags": {
    "allowUnknownTags": ["optional"] //or true
},
"plugins": [
    "node_modules/better-docs-zh/typescript"
],
"source": {
    "includePattern": "\\.(jsx|js|ts|tsx)$",
},
...
```

现在，您可以运行命令 `jsdoc` 并解析 TypeScript 文件。

## 它是如何工作的？

它执行 4 个操作：

* 首先，它将所有 .ts 和 .tsx 文件转译为 .js，以便您使用的所有注释都被视为常规的 JSDoc 注释。

此外，它还会：

* 将所有注释了 `type` 的别名转为 `@typedef`
* 将所有注释了 `interface` 的定义转换为 `@interface`
* 转换类成员的修饰符，包括：`public`、`protected`、`static`

因此，JSDoc 可以自动打印它们。

## 示例

```javascript
/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type ActionRequest = {
  /**
   * parameters passed in an URL
   */
  params: {
    /**
     * Id of current resource
     */
    resourceId: string;
    /**
     * Id of current record
     */
    recordId?: string;
    /**
     * Name of an action
     */
    action: string;

    [key: string]: any;
  };
}
```

转换为：

```javascript
/**
 * ActionRequest'
 * @memberof Action'
 * @alias ActionRequest'
 * @typedef {object} ActionRequest'
 * @property {object} params   parameters passed in an URL'
 * @property {string} params.resourceId   Id of current resource'
 * @property {string} [params.recordId]   Id of current record'
 * @property {string} params.action   Name of an action'
 * @property {any} params.{...}'
 */
```

您也可以以类似的方式注释接口：

```javascript
/**
 * JSON representation of an {@link Action}
 * @see Action
 */
export default interface ActionJSON {
  /**
   * Unique action name
   */
  name: string;
  /**
   * Type of an action
   */
  actionType: 'record' | 'resource' | Array<'record' | 'resource'>;
  /**
   * Action icon
   */
  icon?: string;
  /**
   * Action label - visible on the frontend
   */
  label: string;
  /**
   * Guarding message
   */
  guard?: string;
  /**
   * If action should have a filter (for resource actions)
   */
  showFilter: boolean;
  /**
   * Action component. When set to false action will be invoked immediately after clicking it,
   * to put in another words: there wont be an action view
   */
  component?: string | false | null;
}
```

或者像这样描述你的类属性：

```javascript
/**
 * Class name
 */
class ClassName {
  /**
   * Some private member which WONT be in jsdoc (because it is private)
   */
  private name: string

  /**
   * Some protected member which will go to the docs
   */
  protected somethingIsA: number

  /**
   * And static member which will goes to the docs.
   */
  static someStaticMember: number

  public notCommentedWontBeInJSDoc: string

  constructor(color: string) {}
}
```

# @category 插件

better-docs 还允许您将文档嵌套到侧边栏菜单中的类别和子类别中。

## 用法

在 `jsdoc.json` 文件中添加插件 - 更新 `plugins` 部分：

```json
...
"tags": {
    "allowUnknownTags": ["category"] //or true
},
"plugins": [
    "node_modules/better-docs-zh/category"
],
...
```

然后，您可以在代码中使用 `@category` 和/或 `@subcategory` 标记：

```javascript
/**
 * Class description
 * @category Category
 * @subcategory All
 */
class YourClass {
  ....
}
```

# @component 插件 [BETA]

Better-docs 还可以自动为您的 [React](https://reactjs.org/) 和 [Vue](https://vuejs.org/) 组件生成文档。您唯一需要做的就是添加一个 `@component` 标签。它将从您的组件中获取所有属性，并带有一个 `@example` 标签 - 将生成一个 __实时预览__。

## 安装说明

与之前添加插件类似 - 您必须更新 `jsdoc.json` 文件中的 `plugins` 部分：

```json
...
"tags": {
    "allowUnknownTags": ["component"] //or true
},
"plugins": [
    "node_modules/better-docs-zh/component"
],
...
```

由于 __component__ 插件使用 [parcel](https://parceljs.org) 作为打包器，因此您必须全局安装它。为此，请运行：

```sh
# if you use npm
npm install -g parcel-bundler

# or yarn
yarn global add parcel-bundler
```

## 用法

要在您的 JSDoc 文档中记录组件，只需添加 `@component`：

```jsx
/**
 * Some documented component
 *
 * @component
 */
const Documented = (props) => {
  const { text } = props
  return (
    <div>{text}</div>
  )
}

Documented.propTypes = {
  /**
   * Text is a text
   */
  text: PropTypes.string.isRequired,
}

export default Documented
```

该插件将从您的 [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) 中获取信息，并将它们放入数组中。

对于 Vue，它看起来类似：

```vue
<script>
/**
 * @component
 */
export default {
  name: 'ExampleComponent',
  props: {
    spent: {
      type: Number,
      default: 30,
    },
    remaining: {
      type: Number,
      default: 40,
    }
  },
}
</script>
```

在这种情况下，属性将从 `props` 中获取。

## 预览

`@component` 插件还会修改 `@example` 标签的行为，以便它可以生成实际的 __组件预览__。你要做的就是添加一个 `@example` 标签，并从中返回组件：

**React 示例：**

```jsx
/**
 * Some documented component
 *
 * @component
 * @example
 * const text = 'some example text'
 * return (
 *   <Documented text={text} />
 * )
 */
const Documented = (props) => {
  ///...
}
```

**Vue 示例1：**

```vue
<script>
/**
 * @component
 * @example
 * <ExampleComponent :spent="100" :remaining="50"></ExampleComponent>
 */
export default {
  name: 'ExampleComponent',
  //...
}
</script>
```

**Vue 示例2:**

```vue
<script>
/**
 * @component
 * @example
 * {
 *   template: `<Box>
 *     <ProgressBar :spent="spent" :remaining="50"></ProgressBar>
 *     <ProgressBar :spent="50" :remaining="50" style="margin-top: 20px"></ProgressBar>
 *   </Box>`,
 *   data: function() {
 *     return {spent: 223};
 *   }
 * }
 */
export default {
  name: 'ExampleComponent',
  //...
}
</script>
```

您可以在一个组件中放置任意数量的 `@example` 标签，并像这样“描述”每个标签：

```javascript
/**
 * @component
 * @example <caption>Example usage of method1.</caption>
 * // your example here
 */
```

## 在预览中混合组件

此外，您也可以使用 `@component` 标签来同时记录多个组件。因此，假设您有 2 个组件，在第二个组件中，您希望将第一个组件用作包装器，如下所示：

```javascript
// component-1.js
/**
 * Component 1
 * @component
 *
 */
const Component1 = (props) => {...}

// component-2.js
/**
 * Component 2
 * @component
 * @example
 * return (
 *   <Component1>
 *     <Component2 prop1={'some value'}/>
 *     <Component2 prop1={'some other value'}/>
 *   </Component1>
 * )
 */
const Component2 = (props) => {...}
```

## 包装器组件 [仅限 React]

最有可能的是，您的组件必须在特定的上下文中运行，比如在 redux store provider 中或使用自定义 CSS 库。您可以通过向 `jsdoc.json` 文件中的 `component.wrapper` 传递选项来模拟 _（要阅读有关选项的更多信息 - 向下滚动到 __自定义__ 部分）_

```json
// jsdoc.json
{
    "opts": {...},
    "templates": {
        "better-docs": {
            "name": "Sample Documentation",
            "component": {
              "wrapper": "./path/to/your/wrapper-component.js",
            },
            "...": "...",
        }
    }
}
```

包装器组件可以如下所示：

```javascript
// wrapper-component.js
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(() => ({}), {})

const Component = (props) => {
  return (
    <React.Fragment>
      <head>
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css" />
      </head>
      <Provider store={store}>
        <BrowserRouter>
          {props.children}
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  )
}

export default Component
```

## 样式化 React 示例

Better-docs inserts all examples within an `iframe`. This results in the following styling options:

1. If you pass styles inline - they will work right away.

2. For `css modules` to work with `parcel` bundler - you have to install `postcss-modules` package:

```
yarn add postcss-modules
```

and create a `.postcssrc` file:


```json
// .postcssrc
{
	"modules": true
}
```

3. For [styled-components](https://www.styled-components.com/) you have to use wrapper component which looks like this:

```jsx
import React from 'react'
import { StyleSheetManager } from 'styled-components'

const Component = (props) => {
  const { frameContext } = props
  return (
    <StyleSheetManager target={frameContext.document.head}>
      {props.children}
    </StyleSheetManager>
  )
}

export default Component
```

## Adding commands to bundle entry file

`@component` plugin creates an entry file: `.entry.js` in your _docs_ output folder. Sometimes you might want to add something to it. You can do this by passing: `component.entry` option, which is an array of strings.

So let's say you want to add `babel-polyfill` and 'bulma.css' framework to your bundle. You can do it like this:

```json
// jsdoc.json
{
    "opts": {...},
    "templates": {
        "better-docs": {
            "name": "Sample Documentation",
            "component": {
                "entry": [
                    "import 'babel-polyfill';",
                    "import 'bulma/css/bulma.css';"
                ]
            },
            "...": "...",
        }
    }
}
```

# Customization

First of all, let me state that better-docs extends the `default` template. That is why default template parameters are also handled.

[BETA]: You must explicitly set the `search` option of the `default` template to `true` to enable search

To customize the better-docs pass `options` to `templates['better-docs']`. section in your `jsdoc configuration file`.

Example configuration file with settings for both `default` and `better-docs` templates:

```json
{
    "tags": {
        "allowUnknownTags": ["category"]
    },
    "source": {
        "include": ["./src"],
        "includePattern": ".js$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": [
        "plugins/markdown",
        "jsdoc-mermaid",
        "node_modules/better-docs-zh/category"
    ],
    "opts": {
        "encoding": "utf8",
        "destination": "docs/",
        "readme": "readme.md",
        "recurse": true,
        "verbose": true,
        "tutorials": "./docs-src/tutorials",
        "template": "better-docs"
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "search": true,
        "default": {
            "staticFiles": {
              "include": [
                  "./docs-src/statics"
              ]
            }
        },
        "better-docs": {
            "name": "Sample Documentation",
            "logo": "images/logo.png",
            "title": "", // HTML title
            "css": "style.css",
            "trackingCode": "tracking-code-which-will-go-to-the-HEAD",
	    "hideGenerator": false,
            "navLinks": [
                {
                    "label": "Github",
                    "href": "https://github.com/SoftwareBrothers/admin-bro"
                },
                {
                    "label": "Example Application",
                    "href": "https://admin-bro-example-app-staging.herokuapp.com/admin"
                }
            ]
        }
    }
}
```

## Extras

### typedef(import(...))

better-docs also has one extra plugin for handling typescript'like types imports like (it has to be one-liner):

```javascript
/** @typedef {import('./some-other-file').ExportedType} ExportedType */
```

It simply removes that from the code so JSDoc wont throw an error. In order to use it add this plugin to your plugins section:

```json
  "plugins": [
        "node_modules/better-docs-zh/typedef-import"
    ],
```

# Setting up for the development

If you want to change the theme locally follow the steps:

1. Clone the repo to the folder where you have the project:

```sh
cd your-project
git clone git@github.com:atypiape/better-docs.git
```

or add it as a git submodule:

```sh
git submodule add git@github.com:atypiape/better-docs.git
```

2. Install the packages

```sh
cd better-docs

npm install

# or

yarn
```

3. Within the better-docs folder run the gulp script. It will regenerate documentation every time you change something.

It supports following EVN variables:

* `DOCS_COMMAND` - a command in your root repo which you use to generate documentation: i.e. `DOCS_COMMAND='jsdoc -c jsdoc.json'` or `npm run docs` if you have `docs` command defined in `package.json` file
* `DOCS_OUTPUT` - where your documentation is generated. It should point to the same folder your jsdoc `--destination` conf. But make sure that it is relative to the path where you cloned `better-docs`.
* `DOCS` - list of folders from your original repo what you want to watch for changes. Separated by comma.

```
cd better-docs
DOCS_COMMAND='npm run docs' DOCS=../src/**/*,../config/**/* DOCS_OUTPUT=../docs cd better-docs && gulp
```

The script should launch the browser and refresh it whenever you change something in the template or in `DOCS`.

# Setting up the jsdoc in your project

If you want to see how to setup jsdoc in your project - take a look at these brief tutorials:

- JSDoc - https://www.youtube.com/watch?v=Yl6WARA3IhQ
- better-docs and Mermaid: https://www.youtube.com/watch?v=UBMYogTzsBk

# License

better-docs is Copyright © 2019 SoftwareBrothers.co. It is free software and may be redistributed under the terms specified in the [LICENSE](LICENSE) file - MIT.

# About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>


We're an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://softwarebrothers.co/contact).
* If you want to work for us - check out the [career page](https://softwarebrothers.co/career).
