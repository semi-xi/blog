# npm 的相关处理事项

## 发版流程

整体流程主要是可以看[https://juejin.cn/post/7039140144250617887](这篇文档)

前期是先注册 npm 的账号，在开发完成之后，就在本地登录，登录完毕之后就直接 publish

```
npm login
npm version xxx
npm publish
```

## 发布版本介绍

在 publish 的时候，需要先打版本标签

```
// 补丁版本，按照x.y.z的方式 z自增+1，例如0.0.0 -> 0.0.1
npm version path
// 次版本，按照x.y.z的方式 y自增+1,z为0，例如0.1.1 -> 0.2.0
npm version path
// 主版本，按照x.y.z的方式 x自增+1,y,z为0，例如1.1.1 -> 0.0.0
npm version path
// alpha版本
npm version prereleease --preid=alpha
// aplha 在发版的时候务必打标签
npm publish --tag aplha
// beta版本
npm version prereleease --preid=beta
// beta 在发版的时候务必打标签
npm publish --tag beta
```

## 开发介绍

初始化 项目
`npm init`

这里要注意的是 npm 只支持 js 文件，不支持 ts 文件，所以如果是 ts 文件，需要自行添加 tsc 的编译
`packjson.json`

```
{
 "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

然后在处理 npm 发布之前，自行打一个 build 脚本，生成 js 命令，
tsc 会在 dist 里面中生成好对应的 index.js 文件以及 index.d.ts 类型提供给外部的人使用
