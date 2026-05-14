import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "OrbitDesk",
  description: "AI Business Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body
        className={`${inter.className} bg-black text-white`}
      >

        <Toaster
          position="top-right"
          toastOptions={{

            duration: 4000,

            style: {
              background: "#09090b",
              color: "#ffffff",
              border: "1px solid #27272a",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "14px",
            },

            success: {
              style: {
                border:
                  "1px solid rgba(34,197,94,0.25)",
              },
            },

            error: {
              style: {
                border:
                  "1px solid rgba(239,68,68,0.25)",
              },
            },

          }}
        />

        {children}

      </body>

    </html>
  );
}