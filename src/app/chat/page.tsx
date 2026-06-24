"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export default function ChatPage() {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasUnlock, setHasUnlock] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReceiverId(params.get("id"));
  }, []);

  async function fetchMessages(userId: string, receiver: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${receiver}),and(sender_id.eq.${receiver},receiver_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (userRole === "student" && !hasUnlock) {
      alert("Chat unlock karne ke liye ₹50 payment required hai.");
      return;
    }

    if (!message.trim() || !receiverId || !currentUserId) return;

    const receiver = receiverId;

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: receiver,
      message,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("");
    fetchMessages(currentUserId, receiver);
  }

  useEffect(() => {
    if (!receiverId) return;

    const receiver = receiverId;
    let interval: NodeJS.Timeout;

    async function init() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setCheckingUnlock(false);
        return;
      }

      const userId = userData.user.id;
      setCurrentUserId(userId);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      const role = profile?.role || "";
      setUserRole(role);

      const { data: unlockData } = await supabase
        .from("paid_unlocks")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "paid")
        .maybeSingle();

      setHasUnlock(!!unlockData);
      setCheckingUnlock(false);

      await fetchMessages(userId, receiver);

      interval = setInterval(() => {
        fetchMessages(userId, receiver);
      }, 2000);
    }

    init();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [receiverId]);

  if (checkingUnlock) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        Loading chat...
      </main>
    );
  }

  if (userRole === "student" && !hasUnlock) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-3xl">
          <button onClick={() => window.history.back()} className="text-blue-400">
            ← Back
          </button>

          <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-8">
            <h1 className="text-4xl font-black">Chat Locked 🔒</h1>

            <p className="mt-4 text-gray-300">
              Recruiter se chat karne ke liye KarrierHub Plus unlock karo.
            </p>

            <Link
              href="/student/unlock"
              className="mt-8 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black"
            >
              Pay ₹50 & Unlock
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => window.history.back()} className="text-blue-400">
          ← Back
        </button>

        <h1 className="mt-8 text-4xl font-black">Chat</h1>

        <div className="mt-8 h-[500px] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4">
          {messages.length === 0 && <p className="text-gray-400">No messages yet.</p>}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 max-w-[80%] rounded-2xl p-4 ${
                msg.sender_id === currentUserId ? "ml-auto bg-blue-600" : "bg-white/10"
              }`}
            >
              <p>{msg.message}</p>
              <p className="mt-2 text-xs text-gray-300">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <button className="rounded-xl bg-blue-600 px-6 font-bold">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}