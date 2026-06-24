import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-purple-600/25 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <Link href="/" className="text-sm font-bold text-blue-300 hover:text-blue-200">
          ← Back to Home
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-bold text-blue-100 backdrop-blur-xl">
              Contact KarrierHub
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
              Let’s build the future of{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                hiring together.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Students, employers, recruiters aur businesses — agar aapko support,
              partnership ya hiring help chahiye, KarrierHub team aapke saath hai.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-3xl">📧</p>
                <h3 className="mt-4 text-xl font-black">Support Email</h3>
                <p className="mt-2 text-gray-400">support@karrierhub.in</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-3xl">💼</p>
                <h3 className="mt-4 text-xl font-black">Business</h3>
                <p className="mt-2 text-gray-400">business@karrierhub.in</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-3xl">⚡</p>
                <h3 className="mt-4 text-xl font-black">Response Time</h3>
                <p className="mt-2 text-gray-400">Usually within 24 hours</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-3xl">🇮🇳</p>
                <h3 className="mt-4 text-xl font-black">Location</h3>
                <p className="mt-2 text-gray-400">Built for India</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl md:p-8">
            <h2 className="text-3xl font-black">Send us a message</h2>
            <p className="mt-3 text-gray-400">
              Fill this form and our team will connect with you.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  I am a
                </label>
                <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none focus:border-blue-400">
                  <option>Student / Job Seeker</option>
                  <option>Employer / Recruiter</option>
                  <option>Business / Partnership</option>
                  <option>Support Request</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-400"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-black text-white shadow-lg shadow-blue-600/25 hover:scale-[1.01]"
              >
                Submit Message
              </button>

              <p className="text-center text-sm text-gray-500">
  Trusted by students, recruiters and growing businesses across India.
</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}