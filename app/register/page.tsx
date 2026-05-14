"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister() {

    if (!email || !password) {

      toast.error(
        "Please enter email and password"
      );

      return;
    }

    if (password.length < 6) {

      toast.error(
        "Password must be at least 6 characters"
      );

      return;
    }

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {

        toast.error(error.message);

        return;
      }

      toast.success(
        "Account created successfully"
      );

      router.push("/dashboard");

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

        {/* Header */}
        <div>

          <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
            OrbitDesk
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            Create account
          </h1>

          <p className="mt-3 text-zinc-400">
            Start managing your business with OrbitDesk AI.
          </p>

        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-xl bg-white p-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? "Creating account..."
              : "Register"}

          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-500">

          Already have an account?
          {" "}

          <Link
            href="/login"
            className="text-white transition hover:opacity-80"
          >
            Login
          </Link>

        </div>

      </div>

    </main>
  );
}