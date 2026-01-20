import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalLoadingProvider } from "@/components/providers/GlobalLoadingProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";

// import { Inter, Prompt } from "next/font/google"; // Keep this commented out or remove
import localFont from "next/font/local";

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const prompt = localFont({
  src: [
    { path: "./fonts/Prompt-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Prompt-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Prompt-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Prompt-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Prompt-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata = {
  title: "Judgment registration",
  description: "Judgment registration system (Roleplay)",
};

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
          <I18nProvider>
            <AuthProvider>
              <GlobalLoadingProvider>{children}</GlobalLoadingProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
