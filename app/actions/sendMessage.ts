// app/actions/sendMessage.ts
'use server';

import { revalidatePath } from 'next/cache';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

// This function would typically be in a separate file and imported
const getSocketIO = (): SocketIOServer => {
  if (!io) {
    // @ts-ignore
    const httpServer = (process as any).__server;
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
    });
  }
  return io;
};

export async function sendMessage(formData: FormData) {
  const message = formData.get('message') as string;
  const sender = 'User'; // You'd typically get this from the authenticated user

  if (!message.trim()) {
    return { success: false, message: 'Message cannot be empty' };
  }

  // Here you would typically save the message to a database
  // For example:
  // await db.messages.create({ data: { content: message, sender } })

  // Emit the message via Socket.IO
  const socketIO = getSocketIO();
  socketIO.emit('message', { sender, content: message });

  // Revalidate the path to refresh the messages for other server-rendered pages
  revalidatePath('/');

  return { success: true, message: 'Message sent' };
}
