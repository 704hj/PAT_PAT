import "./globals.css";
import { Dongle } from "next/font/google";

const dongle = Dongle({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dongle",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
