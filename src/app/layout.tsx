import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karrierhub.in"),
  title: {
    default: "KarrierHub - AI Powered Hiring Platform",
    template: "%s | KarrierHub",
  },
  description:
    "KarrierHub helps students, freshers and job seekers find jobs, internships, freelancing work and local hiring opportunities with AI-powered matching.",
  keywords: [
    "KarrierHub",
    "AI hiring platform",
    "student jobs",
    "internships India",
    "part time jobs",
    "freelancing jobs",
    "work from home jobs",
    "freshers jobs",
    "recruiter platform",
  ],
  openGraph: {
    title: "KarrierHub - AI Powered Hiring Platform",
    description:
      "Find jobs, internships, freelancing work and local hiring opportunities with AI-powered matching.",
    url: "https://karrierhub.in",
    siteName: "KarrierHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KarrierHub - AI Powered Hiring Platform",
    description:
      "AI-powered hiring platform for students, freshers, job seekers and recruiters.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}