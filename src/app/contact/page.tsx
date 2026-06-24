export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8">
          Contact Us
        </h1>

        <p className="text-gray-400 mb-10">
          We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 p-6">
            <h2 className="font-bold text-xl mb-2">
              Email
            </h2>

            <p className="text-gray-400">
              support@karrierhub.in
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-6">
            <h2 className="font-bold text-xl mb-2">
              Business Enquiries
            </h2>

            <p className="text-gray-400">
              business@karrierhub.in
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-6">
            <h2 className="font-bold text-xl mb-2">
              Support
            </h2>

            <p className="text-gray-400">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}