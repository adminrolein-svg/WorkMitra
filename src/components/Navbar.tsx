"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [logoClicks, setLogoClicks] = useState(0);

  function handleSecretAdminClick() {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (nextClicks >= 5) {
      setLogoClicks(0);
      router.push("/admin/login");
    }

    setTimeout(() => {
      setLogoClicks(0);
    }, 2000);
  }

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={handleSecretAdminClick} className="text-3xl font-black">
          Karrier<span className="text-blue-500">Hub</span>
        </button>

        <div className="hidden gap-8 text-gray-300 md:flex">
          <a href="#">Jobs</a>
          <a href="#">Internships</a>
          <a href="#">Freelance</a>
          <a href="#">Nearby</a>
        </div>

        <div className="flex gap-3">
          <Link href="/student/login" className="rounded-xl px-4 py-2 hover:bg-white/10">
            Student Login
          </Link>

          <Link href="/student/signup" className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white">
            Student Signup
          </Link>

          <Link href="/employer/login" className="rounded-xl bg-white px-5 py-2 font-bold text-black">
            Employer Login
          </Link>

          <Link href="/employer/signup" className="rounded-xl border border-white/20 px-4 py-2">
            Employer Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}