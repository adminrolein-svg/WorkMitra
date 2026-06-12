import Link from "next/link";

export default function AdminFeedbackPage() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/dashboard" className="text-blue-400">
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Feedback Page</h1>

        <p className="mt-4 text-gray-400">
          Feedback form main route par available hai.
        </p>

        <Link
          href="/feedback"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold"
        >
          Open Feedback
        </Link>
      </div>
    </main>
  );
}