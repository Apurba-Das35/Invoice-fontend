"use client";

import React from "react";
import Link from "next/link";

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
          Login your account
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-cyan-500 py-3.5 text-center text-base font-semibold text-slate-950 shadow-md transition hover:bg-cyan-400 active:scale-[0.99]"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-900">
          Dont’ t Have An Account ?{" "}
          <Link
            href="/register"
            className="text-cyan-600 hover:underline transition ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;