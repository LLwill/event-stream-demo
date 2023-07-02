const http = require('http');
const { EventEmitter } = require('events');

// 创建一个EventEmitter实例
const eventEmitter = new EventEmitter();

// 处理请求的回调函数
const requestHandler = (request, response) => {
  // 设置响应头，指定使用EventStream数据格式
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // 为每个请求创建一个事件监听器，监听自定义事件
  const listener = (data) => {
    // 将数据以EventStream格式发送到客户端
    response.write(`data: ${data}\n\n`);
  };
  eventEmitter.on('customEvent', listener);

  // 当客户端关闭连接时，移除事件监听器
  request.on('close', () => {
    eventEmitter.off('customEvent', listener);
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
  eventEmitter.emit('customEvent', data);
}, 1000);
