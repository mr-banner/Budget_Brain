import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { cookies } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";

const Header = async () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("__session");

  return (
    <div className="fixed top-0 w-full bg-white/20 backdrop-blur-3xl z-50 shadow-md shadow-slate-300/80">
      <nav className="container mx-auto px-7 md:px-15 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={80}
            className="md:h-12 h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {sessionCookie ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 flex items-center gap-2"
              >
                <Button
                  className="cursor-pointer bg-transparent hover:bg-white hover:shadow-[#d5caff] hover:shadow-xl/80 transition-all duration-500 ease-in-out hover:border-[#7f5efd] hover:text-[#7f5efd]"
                  variant="outline"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link
                href="/transaction/create"
                className="text-gray-600 flex items-center gap-2"
              >
                <Button className="cursor-pointer hover:shadow-xl/80 hover:shadow-[#d5caff] bg-[#7f5efd] hover:bg-[#7f5efd] transition-all duration-500 ease-in-out">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Transaction</span>
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    avatar: "h-10 w-10",
                  },
                }}
              />
            </>
          ) : (
            <SignInButton afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
              <Button className="cursor-pointer" variant="outline">
                Login
              </Button>
            </SignInButton>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
