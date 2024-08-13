// 服务器接口方式调用，和chat.js(云函数)二选一方式
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
// const expstate = require('express-state')
// const axios = require("axios");
// app.use(express.static("public"));
const { generateSign, reply, handleError } = require("./utils");
const config = require("./config");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", async (req, res) => {
  res.send("get/ok");
});
// req.body返回示例 {
// senderPlatform: 'Win',
// conversationId: 'cid3dLAcbg7iSU5u1SAQPisRI2UJimY=',
// chatbotCorpId: 'dingb2ab6077bf40eda33b7ba0',
// chatbotUserId: '$:LWCP_v1:$EJgPxyPOiYs/KM4qMeuH8YA',
// msgId: 'msgpT0oDopLnTO9nljg==',
// senderNick: 'name',
// isAdmin: true,
// senderStaffId: 'manager59',
// sessionWebhookExpiredTime: 1723451498337,
// createAt: 1723446048074,
// senderCorpId: 'dingb2ab6077195f415bf40eda33b7ba0',
// conversationType: '1',
// senderId: '$:LWCP_v1:$bVK8ELp4+2forDH2btA==',
// sessionWebhook: 'https://oapi.dingtalk.com/robot/sendBySession?session=xxx',
// text: { content: 'hello' },
// robotCode: 'dingxq7gcwys0azeg',
// msgtype: 'text'
// }
//钉钉机器人后台的消息接收地址(公网可访问)：http://xx.xx.xx.xx/chat
app.post("/chat", async (req, res) => {
  console.log("params==>", req.body);
  const { content } = req.body.text; //钉钉消息内容
  // 示例中，我们只支持文本消息
  if (req.body.msgtype !== "text") {
    reply(req.body, "目前仅支持文本格式的消息。");
    res.send("目前仅支持文本格式的消息");
  }
  // 构建发送给 GPT 的消息体
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content },
  ];

  const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY }));

  try {
    // 请求 GPT 获取回复
    const completion = await openai.createChatCompletion({
      model: config.OPENAI_MODEL,
      messages,
    });

    const responseMessage = completion.data.choices[0].message;

    // 回复钉钉用户消息
    reply(req.body, responseMessage.content);
    res.status(200).send({ status: "200", msg: "ok" });
  } catch (error) {
    // 错误处理，首先打印错误到日志中，方便排查
    console.error(error.response || error);

    // 根据不同的情况来生成不同的错误信息
    const errorMessage = handleError(error);

    // 回复错误信息给用户
    reply(req.body, `错误：${errorMessage}`);
    res.status(500).send({ status: "500", error });
  }
});

// 定义错误处理中间件
app.use((err, req, res, next) => {
  // 参数err下的message保存的就是错误信息
  res.status(500).send(err.message);
});
app.listen(8888, () => {
  console.log("listening on 8888...");
});
