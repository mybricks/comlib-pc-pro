# comlib-pc-pro
PC扩展组件库，基于Antd ProComponents进行的封装开发

## 相关文档

- [Antd ProComponents](https://pro-components.antdigital.dev)
- [通用配置](https://pro-components.antdigital.dev/components/schema)

## 开发流程

### 环境

[Vscode开发插件](https://marketplace.visualstudio.com/items?itemName=Mybricks.Mybricks)

### 安装依赖 

`npm i` 或
`yarn` 或
`pnpm i`

### 调试

点击右侧插件**调试**按钮打开页面即可

## 发布

1. 更新 `package.json` 的 `version` 版本号
2. 更新 组件的 `com.json` 的 `version` 版本号
3. 点击插件的**发布**按钮，选择对应需要发布的 `*.mybricks.json`（这里配置调试和发布的组件）
4. 等待发布完成会打印对应的信息
5. 离线版 需要在 [中心化服务](https://my.mybricks.world/central/materials)选择导出对应物料包，再到对应物料中心导入物料