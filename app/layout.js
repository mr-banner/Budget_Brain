import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budget Brain",
  description: "One stop finance platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* {header} */}
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* {footer} */}
          <footer className="bg-blue-50 py-12">
            <div className="inline-padding text-center text-gray-600">
              <div className="flex justify-center items-center flex-col gap-2">
                <Image
              src="/logo.png"
              alt="Comapny logo"
              width={200}
              height={80}
              />
              <p className="mb-4">
                Your one-stop platform for smarter financial decisions.
              </p>
              </div>

              <div className="flex justify-center gap-6 mb-4 text-sm text-gray-500">
                <a
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </a>
                <a
                  href="/features"
                  className="hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.03 4.29 4.29 0 00-7.3 3.91A12.16 12.16 0 013 4.8a4.28 4.28 0 001.33 5.71 4.28 4.28 0 01-1.94-.54v.06a4.29 4.29 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.29 4.29 0 004 2.98A8.62 8.62 0 012 19.54a12.14 12.14 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2v-.56A8.72 8.72 0 0024 5.56a8.58 8.58 0 01-2.54.7z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.16 1.46-2.16 2.96v5.66H9.33V9h3.41v1.56h.05c.47-.89 1.6-1.83 3.3-1.83 3.53 0 4.18 2.32 4.18 5.35v6.37zM5.34 7.43a2.06 2.06 0 110-4.11 2.06 2.06 0 010 4.11zm-1.78 13.02h3.55V9H3.56v11.45zM22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0z" />
                  </svg>
                </a>
              </div>

              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Budget Brain. All rights
                reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
