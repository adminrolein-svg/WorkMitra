import Navbar from "@/components/Navbar";

export default function Home() {
  const categories = [
    "Part-Time Jobs",
    "Full-Time Jobs",
    "Internships",
    "Freelancing",
    "WFH Jobs",
    "Nearby Jobs",
    "Urgent Hiring",
    "Daily Task Jobs",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1d4ed8_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#7c3aed_0%,transparent_30%)] opacity-40" />

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-gray-300 backdrop-blur">
          Study. Work. Grow.
        </div>

        <h1 className="mt-8 max-w-5xl text-5xl font-black md:text-7xl">
          Your Career Starts{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Here.
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-gray-400">
          Find part-time jobs, internships, freelancing work, work-from-home
          opportunities, nearby jobs and daily task jobs with WorkMItra.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-2xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700">
            Find Jobs
          </button>

          <button className="rounded-2xl border border-white/10 px-8 py-4 font-bold hover:bg-white/10">
            Hire Talent
          </button>
        </div>

        <div className="mt-16 grid w-full max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((job) => (
            <div
              key={job}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10"
            >
              <div className="mb-4 text-2xl">🚀</div>
              <h3 className="font-bold">{job}</h3>
            </div>
          ))}
        </div>

        <div className="mt-16 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["10K+", "Active Jobs"],
            ["5K+", "Students"],
            ["1K+", "Employers"],
            ["98%", "Success Rate"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-3xl font-black text-blue-400">{number}</h3>
              <p className="mt-2 text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}