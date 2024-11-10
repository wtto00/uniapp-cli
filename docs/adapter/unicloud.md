# uniCloud

在 `uniapp-cli.config.json` 中配置 `UNI_CLOUD_PROVIDER`:

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

```bash
# 值为上述配置的JSON.stringify
export UNI_CLOUD_PROVIDER='[{"accessTokenKey":"access_token_mp-****","clientSecret":"****","endpoint":"https://api.next.bspapp.com","envType":"public","provider":"aliyun","requestUrl":"https://api.next.bspapp.com/client","spaceId":"mp-****","spaceName":"****","id":"****"}]'
```

![unicloud后台信息](/unicloud.png)

如上图所示:

- **accessTokenKey**: 等于 `access_token_` + 图中的 `SpaceId`
- **clientSecret**: 等于图中的 `ClientSecret`
- **endpoint**: 等于图中的 `request域名`
- **envType**: 等于 `public`
- **provider**: 等于图中的 `服务商` 所对应的名称
- **requestUrl**: 等于图中的 `request域名` + `/client`
- **spaceId**: 等于图中的 `SpaceId`
- **spaceName**: 等于图中的 `服务空间名称`
- **id**: 等于图中的 `服务空间名称`
