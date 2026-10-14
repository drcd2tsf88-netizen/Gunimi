"use client";

import dynamic from "next/dynamic";

const PostHogInit = dynamic(() => import("./PostHogInit"), { ssr: false });

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PostHogInit />
      {children}
    </>
  );
}
