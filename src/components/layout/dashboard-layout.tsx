"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import Image from "next/image";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/businesses", label: "Businesses", icon: Building2 },
  { href: "/clients", label: "Clients", icon: BriefcaseBusiness },
  { href: "/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const businesses = useAppSelector((state) => state.businesses.items);
  const activeBusinessId = useAppSelector(
    (state) => state.businesses.activeBusinessId,
  );
  const activeBusiness =
    businesses.find((business) => business.id === activeBusinessId) ??
    businesses[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 ">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`w-full border-b border-white/10 bg-slate-900/80 p-4 print:hidden lg:w-72 lg:border-b-0 lg:border-r ${isMenuOpen ? "block" : "hidden lg:block"}`}
        >
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain rounded-md w-8 h-8"
            />

            <h1 className="text-xl text-cyan-300 md:text-2xl font-semibold">
              InvoiceFlow
            </h1>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <CreditCard className="h-4 w-4" />
              Working Context
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {activeBusiness?.companyName}
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur print:hidden lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMenuOpen((value) => !value)}
                  className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-xl text-cyan-300 font-semibold ">
                    Invoice Management
                  </h1>
                </div>
              </div>

              {/* Header Right Side Buttons */}
              <div className="flex items-center gap-3">

                {/* Dynamic Active Login Button */}
                <Link
                  href="/login"
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    pathname === "/login"
                      ? "bg-cyan-500 text-slate-950 font-semibold"
                      : "border border-white/10 bg-slate-800/80 text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>

                {/* Dynamic Active Register Button */}
                <Link
                  href="/register"
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    pathname === "/register"
                      ? "bg-cyan-500 text-slate-950 font-semibold"
                      : "border border-white/10 bg-slate-800/80 text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          </header>

          <main className="p-4 print:p-0 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}