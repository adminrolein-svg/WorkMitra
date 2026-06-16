"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export default function AdminChatsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadChats() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!adminData) {
        alert("You are not admin");
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, message, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
      } else {
        setMessages(data || []);
      }

      setLoading(false);
    }

    loadChats();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) =>
      `
        ${msg.sender_id}
        ${msg.receiver_id}
        ${msg.message}
        ${msg.created_at}
      `
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [messages, search]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        Loading chats...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <h1 className="text-4xl font-black">Access Denied</h1>
        <p className="mt-2 text-gray-400">Only admins can view chats.</p>
        <Link href="/" className="mt-6 inline-block text-blue-400">
          Go Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/dashboard" className="text-blue-400">
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Admin Chat View</h1>

        <p className="mt-2 text-gray-400">
          Safety monitoring only. Admin messages send nahi karega.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats by user id or message..."
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3"
        />

        <div className="mt-8 grid gap-4">
          {filteredMessages.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-gray-400">No messages found.</p>
            </div>
          )}

          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Sender</p>
                  <p className="font-bold text-blue-400">{msg.sender_id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Receiver</p>
                  <p className="font-bold text-purple-400">
                    {msg.receiver_id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-bold">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-black/40 p-4">
                <p className="text-gray-200">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}