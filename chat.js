// @see https://docs.aircode.io/guide/functions/
// const aircode = require('aircode');
const { Configuration, OpenAIApi } = require('openai');
const { generateSign, reply, handleError } = require('./_utils');

// 从环境变量中获取到钉钉和 OpenAI 的相关配置
const DING_APP_SECRET = process.env.DING_APP_SECRET || '';
const OPENAI_KEY = process.env.OPENAI_KEY || '';
// 当前使用的是 OpenAI 开放的最新 GPT-3.5 模型，如果后续 GPT-4 的 API 发布，修改此处参数即可
// OpenAI models 参数列表 https://platform.openai.com/docs/models
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// 主方法(云函数方式调用)
module.exports = async function (params, context) {
  if (context.method !== 'POST') {
    // 钉钉机器人消息是 POST 请求，所以忽略所有非 POST 请求
    return;
  }

  // 如果设置了 SECRET，则进行验证
  if (DING_APP_SECRET) {
    //从 Headers 中拿到 timestamp 和 sign 进行验证
    const { timestamp, sign } = context.headers;
    if (generateSign(timestamp) !== sign) {
      return;
    }
  }

  // 打印请求参数到日志，方便排查
  console.log('Received params:', params);

  const { msgtype, text, conversationId } = params;

  // 示例中，我们只支持文本消息
  if (msgtype !== 'text') {
    return reply(params, '目前仅支持文本格式的消息。');
  }

  // 如果没有配置 OPENAI_KEY，则提醒需要配置
  if (!OPENAI_KEY) {
    return reply(
      params,
      '恭喜你已经调通了机器人，现在请进入 AirCode 中配置 OPENAI_KEY 环境变量，完成 ChatGPT 连接。'
    );
  }

  // 将用户的问题存入数据表中，后续方便进行排查，或者支持连续对话
  const { content } = text;
  // 构建发送给 GPT 的消息体
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content },
  ];


  const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY }));

  try {
    // 请求 GPT 获取回复
    const completion = await openai.createChatCompletion({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 1.0,
    });

    const responseMessage = completion.data.choices[0].message;
    // 回复钉钉用户消息
    return reply(params, responseMessage.content);
  } catch (error) {
    // 错误处理，首先打印错误到日志中，方便排查
    console.error(error.response || error);

    // 根据不同的情况来生成不同的错误信息
    const errorMessage = handleError(error);

    // 回复错误信息给用户
    return reply(params, `错误：${errorMessage}`);
  }
};
