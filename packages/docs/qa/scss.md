# SCSS 相关问题

## DEPRECATION WARNING: The legacy JS API

```
DEPRECATION WARNING: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.

More info: https://sass-lang.com/d/legacy-js-api
```

运行时出现上述警告信息，可以在 `vite.config.js` 中的 `scss` 添加如下配置:

```js
defineConfig({
  plugins: [Uni()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});
```

## DEPRECATION WARNING: Sass @import rules are deprecated

```
DEPRECATION WARNING: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import
```

运行时出现上述警告信息，可以在 `vite.config.js` 中的 `scss` 添加如下配置:

```js
defineConfig({
  plugins: [Uni()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import"],
      },
    },
  },
});
```
