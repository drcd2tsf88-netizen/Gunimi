"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <h1 className="text-4xl font-bold">
          OrbitDesk
        </h1>

        <p className="mt-2 text-zinc-400">
          AI Business Operating System
        </p>

        <div className="mt-8 flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <button
            onClick={handleLogin}
            className="rounded-lg bg-white p-3 font-semibold text-black transition hover:opacity-90"
          >
            Login
          </button>

          <button
            onClick={handleRegister}
            className="rounded-lg border border-zinc-700 p-3 transition hover:bg-zinc-800"
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}