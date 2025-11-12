"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const HeaderClient = () => {
  return (
    <div className="flex items-center space-x-4">
      <SignedIn>
        <Link href="/dashboard">
          <Button
            className="cursor-pointer bg-transparent hover:bg-white hover:shadow-[#d5caff] hover:shadow-xl/80 transition-all duration-500 ease-in-out hover:border-[#7f5efd] hover:text-[#7f5efd]"
            variant="outline"
          >
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
        </Link>

        <Link href="/transaction/create">
          <Button className="cursor-pointer hover:shadow-xl/80 hover:shadow-[#d5caff] bg-[#7f5efd] hover:bg-[#7f5efd] transition-all duration-500 ease-in-out">
            <PenBox size={18} />
            <span className="hidden md:inline">Transaction</span>
          </Button>
        </Link>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>

      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <Button variant="outline">Login</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export default HeaderClient;
