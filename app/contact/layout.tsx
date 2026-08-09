import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Gunimi",
  description: "Get in touch with the Gunimi team. Questions, support, enterprise inquiries, or security disclosures.",
  openGraph: {
    title: "Contact — Gunimi",
    description: "Get in touch with the Gunimi team. Questions, support, enterprise inquiries, or security disclosures.",
    type: "website",
    url: "https://gunimi.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact — Gunimi",
    description: "Get in touch with the Gunimi team.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
