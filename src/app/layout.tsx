import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextAuth食用指南：集成公众号验证码登录",
  description: "NextAuth食用指南：集成公众号验证码登录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
