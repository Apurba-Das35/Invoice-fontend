"use client";

import React from "react";
import Link from "next/link";

const Register = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;
    console.log({ name, photo, email, password });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
          Register your account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Photo URL
            </label>
            <input
              name="photo"
              type="text"
              placeholder="Photo URL"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-cyan-500 py-3.5 text-center text-base font-semibold text-slate-950 shadow-md transition hover:bg-cyan-400 active:scale-[0.99]"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-bold text-slate-900">
          Already Have An Account ?{" "}
          <Link
            href="/login"
            className="text-cyan-600 hover:underline transition ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;