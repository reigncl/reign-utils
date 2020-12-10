# @reignmodule/util-pkg

![NPM Publish package util-pkg](https://github.com/reigncl/reign-utils/workflows/NPM%20Publish%20package%20util-pkg/badge.svg)

Read the package.json file

## How to use

Install with [npm](https://www.npmjs.com/).

```sh
$ npm i @reignmodule/util-pkg
```

Import `@reignmodule/util-pkg` in your code.

```ts
import * as pkg from '@reignmodule/util-pkg'

console.log(`Package Name: ${pkg.pkgName}`) // Package Name: @reignmodule/util-pkg
console.log(`Package Version: ${pkg.pkgVersion}`) // Package Version: 1.0.0
console.log(`${pkg.pkgName}@${pkg.pkgVersion}`) // @reignmodule/util-pkg@1.0.0
```
