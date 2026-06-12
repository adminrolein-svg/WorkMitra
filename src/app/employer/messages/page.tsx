"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ChatUser = {
  user_id: string;
  last_message: string;
  created_at: string;
};

export default function EmployerMessagesPage() {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const uniqueChats: ChatUser[] = [];

      (data || []).forEach((msg) => {
        const otherUser =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

        const exists = uniqueChats.find((chat) => chat.user_id === otherUser);

        if (!exists) {
          uniqueChats.push({
            user_id: otherUser,
            last_message: msg.message,
            created_at: msg.created_at,
          });
        }
      });

      setChats(uniqueChats);
      setLoading(false);
    }

    fetchChats();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Messages</h1>

        {loading && <p className="mt-8 text-gray-400">Loading messages...</p>}

        {!loading && chats.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No messages yet</h2>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {chats.map((chat) => (
            <Link
              key={chat.user_id}
              href={`/chat?id=${chat.user_id}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h2 className="text-xl font-bold">Student Chat</h2>
              <p className="mt-2 text-gray-400">{chat.last_message}</p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(chat.created_at).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}