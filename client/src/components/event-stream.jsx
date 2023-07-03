import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function EventStreamComponent() {
  const [messages, setMessages] = useState([]); // 存储EventStream数据的状态

  const eventSource = useRef(null);

  useEffect(() => {
    // 创建EventSource对象，并连接到EventStream服务器
    eventSource.current = new EventSource('http://127.0.0.1:3000/');

    // 监听message事件，在收到新消息时更新数据
    eventSource?.current.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message.content.parts[0]]); // 将新数据添加到数组中
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
        {messages.map((message) => (
          <ReactMarkdown key={message.id} components={{
            code({node, inline, className, children, ...props}) {
              console.log(inline, className, children[0]);
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={docco}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            }
          }}>{message}</ReactMarkdown>
        ))}
        <div style={{position: 'fixed', top: '10px', right: '20px'}}>
        <button onClick={handleOnClick}>stop</button>
        </div>
    </div>
  );
}

export default EventStreamComponent;
