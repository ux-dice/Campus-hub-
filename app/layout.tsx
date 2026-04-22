import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusHub — Your campus. All in one place.",
  description: "The social platform for Indian college students. Share projects, join events, connect with 4,800+ students across 4 colleges.",
  keywords: "campus, students, college, India, VIT, projects, events, social",
  openGraph: {
    title: "CampusHub",
    description: "Your campus. All in one place.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
