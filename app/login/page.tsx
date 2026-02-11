import { login, loginWithGoogle } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 relative animate-in fade-in duration-500">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg2.jpg"
          alt="Background Sky"
          fill
          priority
          className="object-cover object-top"
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-t from-transparent backdrop-blur-sm" />
      </div>

      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:top-8 md:left-8 animate-in fade-in slide-in-from-left-4 duration-500 ease-out"
        asChild
      >
        <Link href="/">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
      </Button>

      <Card className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login Task Manager</CardTitle>
          <CardDescription>Pilih cara masuk yang lo suka.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* === 1. TOMBOL LOGIN GOOGLE === */}
          <form action={loginWithGoogle} className="mb-4">
            <Button
              variant="outline"
              className="w-full py-5 relative hover:bg-zinc-50 transition-colors"
              type="submit"
            >
              {/* Icon Google SVG */}
              <svg className="mr-2 h-5 w-5 absolute left-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Lanjut dengan Google
            </Button>
          </form>

          {/* PEMBATAS */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500">
                Atau pake email
              </span>
            </div>
          </div>

          <form className="grid gap-4">
            {message && (
              <div className="p-3 bg-blue-50 text-blue-900 text-sm rounded-md border border-blue-200 animate-in fade-in zoom-in-95 duration-300">
                {message}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button formAction={login} className="w-full">
              Sign In with Email
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="underline font-medium hover:text-blue-600 transition-colors"
            >
              Daftar dulu disini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
