# PNPM 相关问题

## Module not found: Error: Can't resolve '@babel/runtime/helpers/typeof'

```
 ERROR  Failed to compile with 2 errors00:21:57

 error  in ./src/main.js

Module not found: Error: Can't resolve '@babel/runtime/helpers/defineProperty' in 'E:\projects\demo\uniapp-demo-vue2\src'

 error  in ./src/uni.promisify.adaptor.js

Module not found: Error: Can't resolve '@babel/runtime/helpers/typeof' in 'E:\projects\demo\uniapp-demo-vue2\src'
```

运行时出现上述错误信息，可以在项目根目录添加文件 `.npmrc`, 内容如下:

```
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true
```
