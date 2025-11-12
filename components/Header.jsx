import Image from "next/image";
import Link from "next/link";
import React from "react";
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./Header-client";

const Header = async () => {
  await checkUser();

  return (
    <div className="fixed top-0 w-full bg-white/20 backdrop-blur-3xl z-50 shadow-md shadow-slate-300/80">
      <nav className="container mx-auto px-7 md:px-15 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={80}
            className="md:h-12 h-10 w-auto object-contain"
          />
        </Link>
        <HeaderClient />
      </nav>
    </div>
  );
};

export default Header;
