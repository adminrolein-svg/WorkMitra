"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type StatsData = {
  jobs: number;
  applicants: number;
  accepted: number;
  pending: number;
};

export default function EmployerDashboard() {
  const [statsData, setStatsData] = useState<StatsData>({
    jobs: 0,
    applicants: 0,
    accepted: 0,
    pending: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id")
        .eq("employer_id", userData.user.id);

      const jobIds = jobs?.map((job) => job.id) || [];

      let applications: any[] = [];

      if (jobIds.length > 0) {
        const { data } = await supabase
          .from("applications")
          .select("status, job_id")
          .in("job_id", jobIds);

        applications = data || [];
      }

      setStatsData({
        jobs: jobIds.length,
        applicants: applications.length,
        accepted: applications.filter(
          (app) =>
            app.status === "Accepted" ||
            app.status === "accepted"
        ).length,
        pending: applications.filter(
          (app) =>
            app.status === "Applied" ||
            app.status === "pending" ||
            app.status === "Pending"
        ).length,
      });
    }

    loadStats();
  }, []);

  const cards = [
    {
      href: "/employer/post-job",
      title: "Post Job",
      desc: "Create hiring posts with smart approval flow.",
      icon: "🚀",
      tag: "Create",
      style: "from-blue-600/30 to-cyan-500/10 border-blue-400/30",
    },
    {
      href: "/employer/jobs",
      title: "My Jobs",
      desc: "Manage active, pending and auto-approved jobs.",
      icon: "📌",
      tag: "Manage",
      style: "from-green-600/30 to-emerald-500/10 border-green-400/30",
    },
    {
      href: "/employer/applicants",
      title: "Applicants",
      desc: "Review, shortlist, accept and reject candidates.",
      icon: "👥",
      tag: "Hiring",
      style: "from-purple-600/30 to-blue-500/10 border-purple-400/30",
    },
    {
      href: "/employer/analytics",
      title: "Analytics",
      desc: "Track applicants, status and hiring performance.",
      icon: "📊",
      tag: "Insights",
      style: "from-yellow-600/30 to-orange-500/10 border-yellow-400/30",
    },
    {
      href: "/employer/messages",
      title: "Messages",
      desc: "Chat directly with students and applicants.",
      icon: "💬",
      tag: "Chat",
      style: "from-indigo-600/30 to-purple-500/10 border-indigo-400/30",
    },
    {
      href: "/employer/company-profile",
      title: "Company Profile",
      desc: "Build recruiter trust with verified company details.",
      icon: "🏢",
      tag: "Trust",
      style: "from-slate-600/30 to-blue-500/10 border-white/20",
    },
    {
      href: "/employer/interview-generator",
      title: "AI Interview Generator",
      desc: "Generate smart interview questions instantly.",
      icon: "🤖",
      tag: "AI Tool",
      style: "from-cyan-600/30 to-blue-500/10 border-cyan-400/30",
    },
  ];

  const quickStats = [
    ["Active Jobs", statsData.jobs, "", "text-cyan-300", "border-cyan-400/20 bg-cyan-500/10"],
    ["Applicants", statsData.applicants, "", "text-purple-300", "border-purple-400/20 bg-purple-500/10"],
    ["Accepted", statsData.accepted, "", "text-green-300", "border-green-400/20 bg-green-500/10"],
    ["Pending", statsData.pending, "", "text-yellow-300", "border-yellow-400/20 bg-yellow-500/10"],
  ];

  const staticStats = [
    ["Hiring Score", 92, "%", "text-cyan-300"],
    ["Fast Shortlist", 5, " Top", "text-purple-300"],
    ["Auto Approval", 100, " ₹", "text-green-300"],
    ["Verified Flow", 100, "%", "text-blue-300"],
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 animate-pulse rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Work<span className="text-blue-400">Mitra</span>
          </Link>

          <Link
            href="/employer/post-job"
            className="rounded-2xl bg-white px-5 py-3 font-black text-black hover:scale-105"
          >
            Post Job →
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-200">
                ⚡ Employer Hiring Command Center
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                Hire Faster With{" "}
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Smart AI Tools.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
                Post jobs, verify your company, review applicants, shortlist top
                candidates, chat with students and track hiring performance from
                one premium dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/employer/post-job"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 font-black shadow-lg shadow-purple-600/30 hover:scale-105"
                >
                  🚀 Create Job Post
                </Link>

                <Link
                  href="/employer/applicants"
                  className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black backdrop-blur hover:bg-white/15"
                >
                  View Applicants
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
              <p className="text-sm font-bold text-gray-400">
                Hiring Funnel Preview
              </p>

              <div className="mt-5 space-y-4">
                {[
                  ["Posted Jobs", "100%", "w-full", "from-blue-500 to-cyan-300"],
                  ["Applicants", "76%", "w-[76%]", "from-purple-500 to-blue-400"],
                  ["Shortlisted", "54%", "w-[54%]", "from-yellow-500 to-orange-400"],
                  ["Accepted", "32%", "w-[32%]", "from-green-500 to-emerald-300"],
                ].map(([label, value, width, gradient]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-200">{label}</span>
                      <span className="text-gray-400">{value}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full ${width} rounded-full bg-gradient-to-r ${gradient}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 p-4 text-green-300">
                ✅ Verified recruiters get higher trust on student side.
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {quickStats.map(([label, value, suffix, color, box]) => (
            <motion.div
              key={String(label)}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`rounded-3xl border ${box} p-6 backdrop-blur-xl`}
            >
              <h2 className={`text-4xl font-black ${color}`}>
                <CountUp end={Number(value)} duration={2} separator="," />
                {suffix}
              </h2>
              <p className="mt-2 text-gray-300">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {staticStats.map(([label, value, suffix, color]) => (
            <motion.div
              key={String(label)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl hover:border-purple-400/40 hover:bg-white/10"
            >
              <h2 className={`text-4xl font-black ${color}`}>
                <CountUp end={Number(value)} duration={2} separator="," />
                {suffix}
              </h2>
              <p className="mt-2 text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((card) => (
            <motion.div
              key={card.href}
              variants={{
                hidden: { opacity: 0, y: 25 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10, scale: 1.025 }}
            >
              <Link
                href={card.href}
                className={`group relative block h-full overflow-hidden rounded-[1.7rem] border bg-gradient-to-br ${card.style} p-6 shadow-xl shadow-black/25 backdrop-blur-xl hover:shadow-purple-950/40`}
              >
                <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-white/10 blur-2xl transition group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
                      {card.icon}
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-gray-200">
                      {card.tag}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-black">{card.title}</h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-300">
                    {card.desc}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-200">
                      Open
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-cyan-600/15 p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black">
                Ready to hire your next talent?
              </h2>
              <p className="mt-2 text-gray-300">
                Create job → Get applicants → AI shortlist → Chat → Hire.
              </p>
            </div>

            <Link
              href="/employer/post-job"
              className="rounded-2xl bg-white px-6 py-4 font-black text-black hover:scale-105"
            >
              Post New Job
            </Link>
          </div>
        </section>
      </motion.div>
    </main>
  );
}