import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catmon Lab — сделай из кота легендарную карточку",
  description:
    "Превращай фото своих котов в коллекционные покемон-карточки с помощью нейросети. Стилизуй, сохраняй, собирай коллекцию.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-950 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
