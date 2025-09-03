# 使用axios流程

1. 安装
2. 创建src/axios/index.js
3. 配置axios: 在main.js中配置导入即可
4. 封装axios请求: 在api下封装请求即可
5. 使用axios请求: 在页面调用即可，调用的就是第四步封装好的。

# 报错记录

## 在页面从api中导入请求函数报错：

```js
import { uploadFileForOCR } from '@/api/ocr'
```

报错信息：找不到该模块
原因：
虽然你的 src/api/ocr/index.js 文件确实存在，但是 TypeScript 配置有问题。

问题原因： 你的项目使用了 TypeScript（HomeView.vue 中有 TypeScript 语法），但是 tsconfig.json 中缺少路径映射配置。虽然 jsconfig.json 中有 @/\* 的路径配置，但 TypeScript 项目主要依赖 tsconfig.json 。

解决方案： 在 tsconfig.json 中添加路径映射配置：
增加了下面的内容：

```json
    "paths": {
      "@/*": ["./src/*"]
    },
```

全部内容是：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

还是没解决，再继续解决
报错信息变了，如下：

```txt
无法找到模块“@/api/ocr”的声明文件。“/Users/alsc/Desktop/code/front/ocr_front/src/api/ocr/index.js”隐式拥有 "any" 类型。
```

解决方案：
将 src/api/ocr/index.js 重命名为 src/api/ocr/index.ts 并添加类型：

## 报错2

请求处理的finally()找不到
原因：
用户遇到 Promise.finally() 方法不存在的错误，这是因为 TypeScript 编译器目标库版本太低。我需要检查当前的 tsconfig.json 配置，然后提供解决方案。

这个错误是因为 TypeScript 配置中缺少 lib 选项，导致编译器不知道支持哪些 JavaScript 库特性。 Promise.finally() 方法是在 ES2018 中引入的。

问题原因： 虽然你的 target 设置为 ESNext ，但没有指定 lib 选项，TypeScript 编译器默认使用较老的库定义，不包含 Promise.finally() 方法。

解决方案： 在 tsconfig.json 中添加 lib 配置：

增加了下面的内容：

```json
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
```

全部内容是：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```
