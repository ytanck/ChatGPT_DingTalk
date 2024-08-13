# 用 JavaScript 五分钟开发一个钉钉 ChatGPT 机器人

本文帮助你快速实现一个钉钉对话机器人，并在其中接入 ChatGPT 的能力，可以直接问它问题，也可以在群聊天中 at 它，返回 ChatGPT 的回答。（以下为效果截图）
修改后增加了连续聊天并修改了GPT模型

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/demo-screenshot.jpeg" width="665px" /></p>

## 通过本文你将学会

1. 创建一个钉钉机器人
2. 使用 AirCode 的「一键复制代码」功能，实现机器人聊天
3. 将机器人接入 ChatGPT，实现智能对话

## 第一步：创建钉钉机器人

1. 进入[钉钉开发者后台](https://open-dev.dingtalk.com/)，选择**应用开发 > 企业内部开发**，点击**创建应用**按钮，在弹出的对话框中输入名称、简介等信息，完成应用创建。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/dingtalk-platform.jpeg" width="1469px" /></p>

2. 在创建好的应用页面中，点击左侧菜单的**应用功能 > 消息推送**，并打开**机器人配置**。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/switch-on-robot.jpeg" width="1469px" /></p>

3. 在机器人配置的表单中，依次填入机器人名称、机器人图标、机器人简介、机器人描述和机器人消息预览图，并点击**发布**按钮完成发布。

    **注意：由于钉钉的安全策略，机器人名称中不要包含「ChatGPT」关键字，否则后续无法正常调用。**

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/input-robot-info-1.jpeg" width="1207px" /></p>

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/input-robot-info-2.jpeg" width="997px" /></p>

4. 发布成功后，进入**基础信息 > 应用信息**，可以看到 **AppKey** 和 **AppSecret**，点击复制备用。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/copy-app-secret.jpeg" width="1469px" /></p>

## 第二步：创建 AirCode 应用

1. 通过 [AirCode 源码链接](https://aircode.cool/xspb3by9fs)中右上角的「Get a copy」按钮快速生成一个自己的 AirCode Node.js 应用。 **注意不要直接复制代码，如果是直接复制纯代码粘贴过去，需要再手工安装 NPM 依赖包。** 如果没有登录，需先登录 AirCode。推荐使用 GitHub 登录，会快一些。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/feishu-chatGPT/6-get-copy.png" width="800px" /></p>

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/login.jpeg" width="1294px" /></p>

2. 在弹出的对话框中，输入应用名称，并点击 **Create** 完成创建。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/create-aircode-app.jpeg" width="1469px" /></p>

3. 将[钉钉开发者后台](https://open-dev.dingtalk.com/fe/app#/corp/app)中机器人的 AppKey 和 AppSecret，粘贴到 AirCode 应用的环境变量（Environments）中。在 **DING_APP_KEY** 的 value 中填入 AppKey，在 **DING_APP_SECRET** 的 value 中填入 AppSecret。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/enter-dingtalk-envs.jpeg" width="1469px" /></p>

4. 点击顶部的 **Deploy** 按钮，部署整个应用，使配置生效。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/deploy.jpeg" width="1469px" /></p>

## 第三步：配置机器人接口和权限

1. 部署成功后，选择调用文件 **chat.js**，可以在编辑器函数名称下看到调用 URL，点击复制 URL。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/copy-invoke-url.jpeg" width="1469px" /></p>

2. 进入[钉钉开发者后台](https://open-dev.dingtalk.com/fe/app#/corp/app)中刚刚创建的机器人页面，在**应用功能 > 消息推送**中，将调用 URL 填写到**消息接收地址**项，并点击**发布**。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/enter-webhook.jpeg" width="1469px" /></p>

3. 进入**基础信息 > 权限管理**，在搜索框中输入「企业内机器人发送消息权限」，会看到列表中找到了对应的权限，点击右侧的**申请权限**按钮，完成权限配置。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/switch-on-privilege.jpeg" width="1469px" /></p>

## 第四步：测试聊天机器人

1. 完成配置后，在钉钉的聊天窗口中可以搜到机器人进行私聊，或者将机器人加入到群中 at 机器人聊天。此时机器人已经可以对话了，但由于还没有配置 ChatGPT 能力，所以机器人会回复告知需要配置 OPENAI_KEY。

    提示：如果你的机器人返回了类似于「系统正在维护，无法使用 @ 能力」的回复，说明你的机器人名称或简介中包含了「ChatGPT」关键字，被钉钉屏蔽了，更改一下名称或简介后，重新发布即可。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/test-robot-reply.jpeg" width="665px" /></p>

2. 在 AirCode 中选中 chat.js 函数，并点击右侧 Debug 标签下的 **Mock by online request** 按钮，在弹出对话框中可以看到刚才收到的请求，点击 **Use this to debug** 则可以使用线上真实的请求数据来调试。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/mock-by-online-requests.jpeg" width="1469px" /></p>

## 第五步：接入 ChatGPT 能力

1. 登录到你的 [OpenAI 控制台](https://platform.openai.com/account/api-keys)中（如果还没有账号，需要注册一个），进入 **API Keys** 页面，点击 **Create new secret key** 创建一个密钥。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/create-openai-key.jpeg" width="1112px" /></p>

2. 在弹出的对话框中，点击复制图标，将这个 API Key 复制并保存下来。**注意：正确的 API Key 都是以 sk- 开头的字符串。**

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/copy-api-key.jpeg" width="534px" /></p>

3. 进入刚才创建好的 AirCode 应用中，在 **Environments** 标签页，将复制的 API Key 的值填入 **OPENAI_KEY** 这一项的 value 中。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/enter-api-env.jpeg" width="1469px" /></p>

4. 再次点击 **Deploy** 部署应用后，可以在钉钉中测试。目前 ChatGPT 服务比较慢，尤其是模型版本越高级、问题越复杂，ChatGPT 服务的返回时间会越长。

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/deploy.jpeg" width="1469px" /></p>

<p align="center"><img src="https://docs-cn.aircode.io/_images/tutorials/dingtalk-chatgpt/test-chat-gpt.jpeg" width="723px" /></p>

## 问题反馈

- 微信、钉钉、飞书等用户交流群，点击 [https://docs-cn.aircode.io/help/](https://docs-cn.aircode.io/help/)

## 更多阅读

- 企业微信、钉钉、飞书、iOS Siri 接入 ChatGPT 手把手教程，全部源码，免费托管，点击 [https://docs-cn.aircode.io/chatgpt/](https://docs-cn.aircode.io/chatgpt/)
