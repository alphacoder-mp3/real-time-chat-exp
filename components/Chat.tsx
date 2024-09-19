'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { sendMessage } from '@/app/actions/sendMessage';

let socket: Socket;

export default function Chat() {
  const [messages, setMessages] = useState<
    Array<{ sender: string; content: string }>
  >([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io({ path: '/api/socket' });

      socket.on('message', data => {
        setMessages(prev => [...prev, data]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get('message') as string;

    if (message.trim()) {
      const messageData = { sender: 'User', content: message };
      socket.emit('message', messageData);
      await sendMessage(formData);
      formRef.current?.reset();
    }
  };
  console.log({ messages });
  return (
    <div>
      <div className="mb-4 h-64 overflow-y-auto border p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong className="text-white">{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} ref={formRef}>
        <input
          type="text"
          name="message"
          className="mr-2 rounded border p-2"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
