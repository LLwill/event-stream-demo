const http = require('http');
const { EventEmitter } = require('events');

// 创建一个EventEmitter实例
const eventEmitter = new EventEmitter();

// 处理请求的回调函数
const requestHandler = (request, response) => {
  // 设置响应头，指定使用EventStream数据格式
  response.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // 为每个请求创建一个事件监听器，监听自定义事件
  const listener = (data) => {
    // 将数据以EventStream格式发送到客户端
    const _data = {
      time: data,
      "message": {
        "id": "dca91d08-9386-4b0f-a830-9949c7ee82ef",
         "author": {
          "role": "assistant",
           "name": null,
            "metadata": {}
          }, 
          "create_time": 1688230628.783544,
           "update_time": null,
            "content": {
              "content_type": "text",
               "parts": ["\u5f53\u5904\u7406EventStream\u5185\u5bb9\u65f6\uff0c\u6211\u4eec\u5047\u8bbe\u4f60\u4f7f\u7528React\u4f5c\u4e3a\u524d\u7aef\u6846\u67b6\u3002\u4ee5\u4e0b\u662f\u4e00\u4e2a\u57fa\u672c\u7684\u524d\u7aef\u4ee3\u7801\u793a\u4f8b\uff0c\u6f14\u793a\u4e86\u5982\u4f55\u4f7f\u7528React\u6765\u4f18\u96c5\u5730\u6e32\u67d3EventStream\u5185\u5bb9\uff1a\n\n```javascript\nimport React, { useState, useEffect } from 'react';\n\nfunction EventStreamComponent() {\n  const [messages, setMessages] = useState([]); // \u5b58\u50a8EventStream\u6570\u636e\u7684\u72b6\u6001\n\n  useEffect(() => {\n    // \u521b\u5efaEventSource\u5bf9\u8c61\uff0c\u5e76\u8fde\u63a5\u5230EventStream\u670d\u52a1\u5668\n    const eventSource = new EventSource('/eventstream');\n\n    // \u76d1\u542cmessage\u4e8b\u4ef6\uff0c\u5728\u6536\u5230\u65b0\u6d88\u606f\u65f6\u66f4\u65b0\u6570\u636e\n    eventSource.addEventListener('message', (event) => {\n      const data = JSON.parse(event.data);\n      setMessages((prevMessages) => [...prevMessages, data]); // \u5c06\u65b0\u6570\u636e\u6dfb\u52a0\u5230\u6570\u7ec4\u4e2d\n    });\n\n    return () => {\n      // \u5728\u7ec4\u4ef6\u5378\u8f7d\u65f6\u5173\u95edEventSource\u8fde\u63a5\n      eventSource.close();\n    };\n  }, []);\n\n  return (\n    <div>\n      <h1>EventStream Content:</h1>\n      <ul>\n        {messages.map((message) => (\n          <li key={message.id}>{message.data}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default EventStreamComponent;\n```\n\n\u5728\u8fd9\u4e2a\u793a\u4f8b\u4e2d\uff0c\u6211\u4eec\u4f7f\u7528React\u7684\u51fd\u6570\u5f0f\u7ec4\u4ef6\u548c`useState`\u3001`useEffect`\u7b49\u94a9\u5b50\u6765\u5904\u7406EventStream\u5185\u5bb9\u7684\u6e32\u67d3\u3002\n\n\u5728`EventStreamComponent`\u7ec4\u4ef6\u4e2d\uff0c\u6211\u4eec\u4f7f\u7528`useState`\u94a9\u5b50\u6765\u521b\u5efa`messages`\u72b6\u6001\uff0c\u5b83\u5b58\u50a8\u4e86EventStream\u7684\u6570\u636e\u3002\u6211\u4eec\u4f7f\u7528`setMessages`\u51fd\u6570\u6765\u66f4\u65b0`messages`\u72b6\u6001\uff0c\u5e76\u5728\u63a5\u6536\u5230\u65b0\u7684"]
              }, 
              "status": "in_progress",
               "end_turn": null,
                "weight": 1.0,
                 "metadata": {
                  "message_type": "next",
                   "model_slug": "text-davinci-002-render-sha"
                  }, 
                  "recipient": "all"
                }, 
                "conversation_id": "d5cc17a5-b629-485f-aab9-69815f4747fe",
                 "error": null
                };
    // response.write(`data: ${JSON.stringify(_data)}\n\n`);
    // 自定义事件类型（前端对应使用该类型取值）
    // response.write('event: custom-event\n');
    response.write(`data: ${JSON.stringify(_data)} \n\n`);
  };
  eventEmitter.on('usermessage', listener);

  // 当客户端关闭连接时，移除事件监听器
  request.on('close', () => {
    eventEmitter.off('usermessage', listener);
  });
};

// 创建HTTP服务器
const server = http.createServer(requestHandler);

// 监听端口
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// 示例：每秒触发一个自定义事件，发送数据到EventStream
setInterval(() => {
  const data = new Date().toISOString();
  eventEmitter.emit('usermessage', data);
}, 1000);
