import React, { useState, useEffect, useRef } from 'react';

function EventStreamComponent() {
  const [messages, setMessages] = useState([]); // 存储EventStream数据的状态

  const eventSource = useRef(null);

  useEffect(() => {
    // 创建EventSource对象，并连接到EventStream服务器
    eventSource.current = new EventSource('http://127.0.0.1:3000/');

    // 监听message事件，在收到新消息时更新数据
    eventSource?.current.addEventListener('message', (event) => {
      console.log(event, 'event');
      const data = event.data;
      setMessages((prevMessages) => [...prevMessages, data]); // 将新数据添加到数组中
    });

    return () => {
      // 在组件卸载时关闭EventSource连接
      eventSource?.current.close();
    };
  }, []);

  const handleOnClick = () => {
    console.log(eventSource?.current, 'eventSource');
    eventSource?.current?.close();
  }

  return (
    <div>
      <h1>EventStream Content:</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message}</li>
        ))}
      </ul>
      <button onClick={handleOnClick}>stop</button>
    </div>
  );
}

export default EventStreamComponent;
