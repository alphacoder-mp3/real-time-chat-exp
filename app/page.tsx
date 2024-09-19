// app/page.tsx
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat App</h1>
      <Chat />
    </main>
  );
}
