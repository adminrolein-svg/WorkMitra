export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black mb-8">
          About KarrierHub
        </h1>

        <p className="text-gray-300 text-lg mb-6">
          KarrierHub is an AI-powered hiring platform connecting students,
          freshers, freelancers, and job seekers with employers across India.
        </p>

        <p className="text-gray-400 mb-6">
          Our mission is simple: make hiring faster and make jobs easier to
          find.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold mb-3">
              Students
            </h2>
            <p className="text-gray-400">
              Find internships, part-time jobs and career opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold mb-3">
              Employers
            </h2>
            <p className="text-gray-400">
              Hire skilled candidates quickly using AI-powered tools.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold mb-3">
              AI Matching
            </h2>
            <p className="text-gray-400">
              Smart recommendations help candidates find relevant jobs faster.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}