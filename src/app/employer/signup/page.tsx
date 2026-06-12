"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EmployerSignupPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: companyName,
        email,
        role: "employer",
      });

      if (profileError) {
        alert(profileError.message);
        setLoading(false);
        return;
      }

      alert("Employer account created successfully!");
      router.push("/employer/login");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <Link href="/" className="text-3xl font-black">
          Stu<span className="text-blue-500">...an> className="text-blue-500">Work</span> className="text-blue-500">...an> className="text-blue-500">Work</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Employer Registration</h1>

        <p className="mt-2 text-gray-400">Create your employer account.</p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Company / Employer Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-gray-200 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Employer Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/employer/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}