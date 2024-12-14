# uniCloud 适配指南

如果项目中使用了 `uniCloud`，需要按照以下方式配置，才可以正常连接 `云端云函数`。不支持连接 `本地云函数`。

在 `uniapp.config.json` 中配置 `UNI_CLOUD_PROVIDER`:

```jsonc
{
  "env": {
    "UNI_CLOUD_PROVIDER": [
      {
        "accessTokenKey": "access_token_mp-****",
        "clientSecret": "****",
        "endpoint": "https://api.next.bspapp.com",
        "envType": "public",
        "provider": "aliyun",
        "requestUrl": "https://api.next.bspapp.com/client",
        "spaceId": "mp-****",
        "spaceName": "****",
        "id": "****"
      }
    ]
  }
}
```

或者在环境变量中配置:

```shell
# 值为上述配置的JSON.stringify
export UNI_CLOUD_PROVIDER='[{"accessTokenKey":"access_token_mp-****","clientSecret":"****","endpoint":"https://api.next.bspapp.com","envType":"public","provider":"aliyun","requestUrl":"https://api.next.bspapp.com/client","spaceId":"mp-****","spaceName":"****","id":"****"}]'
```

打开 [uniCloud 后台](https://unicloud.dcloud.net.cn/)，选择用到的服务空间，点击进入详情，如下图所示:

![unicloud后台信息](/unicloud.png)

- **accessTokenKey**: 等于 `access_token_` + 图中的 `SpaceId`
- **clientSecret**: 等于图中的 `ClientSecret`
- **endpoint**: 等于图中的 `request域名`
- **envType**: 等于 `public`
- **provider**: 等于图中的 `服务商` 所对应的名称
- **requestUrl**: 等于图中的 `request域名` + `/client`
- **spaceId**: 等于图中的 `SpaceId`
- **spaceName**: 等于图中的 `服务空间名称`
- **id**: 等于图中的 `服务空间名称`
