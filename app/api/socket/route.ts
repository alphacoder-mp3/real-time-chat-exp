import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export async function GET() {
  if (!io) {
    console.log('Socket is initializing');

    const httpServer = (process as any).__server;
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
    });

    io.on('connection', socket => {
      console.log('New client connected');

      socket.on('message', (data: { sender: string; content: string }) => {
        io.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  } else {
    console.log('Socket is already running');
  }

  return NextResponse.json({ success: true });
}
