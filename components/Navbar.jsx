//components/Navbar.jsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  Menu,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Home,
  Image,
  Upload,
  ShieldCheck,
  Info,
  Mail,
} from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ToggleTheme } from "./ToggleTheme";
import { signOut, useSession } from "next-auth/react";

// This would come from your authentication system

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: session, status: sessionStatus } = useSession();
  const userRole = session?.user?.role || "guest";

  const NavItems = React.useCallback(
    () => (
      <>
        <Button variant="ghost" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/artworks">
            <Image className="w-4 h-4 mr-2" />
            View Artworks
          </Link>
        </Button>

        {userRole === "artist" && (
          <>
            <Button variant="ghost" asChild>
              <Link href="/artist-console">
                <Upload className="w-4 h-4 mr-2" />
                Console
              </Link>
            </Button>
          </>
        )}
        {userRole === "admin" && (
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin Portal
            </Link>
          </Button>
        )}
        <ToggleTheme />
      </>
    ),
    [userRole]
  );

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center font-semibold text-lg mr-4">
          <Palette className="w-6 h-6 mr-2 text-primary" />
          ArtGallery
        </Link>
        {isDesktop ? (
          <>
            <div className="flex items-center space-x-4 flex-1">
              <NavItems />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {userRole === "guest" ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer">
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <User className="h-4 w-4" />
                        <span className="sr-only">Open user menu</span>
                      </Button>
                      <h1 className="font-semibold text-sm">
                        {session.user.name}
                      </h1>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/" onClick={() => signOut()}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-4">
                <NavItems />
                <Separator />
                {userRole === "guest" ? (
                  <>
                    <Button asChild>
                      <Link href="/login">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href={`/profile/${session.user.id}`}>Profile</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/" onClick={() => signOut()}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
