import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalLoadingProvider } from "@/components/providers/GlobalLoadingProvider";

export const metadata = {
  title: "Judgment Notes",
  description: "Roleplay judgment note system",
};

import { Inter, Prompt } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${prompt.variable}`}
      suppressHydrationWarning
    >
      <body className={prompt.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <GlobalLoadingProvider>{children}</GlobalLoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
