import { login } from "./actions";
import Link from "next/link";
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
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:top-8 md:left-8"
        asChild
      >
        <Link href="/">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
      </Button>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login Task Manager</CardTitle>
          <CardDescription>
            Masukin email & password lo buat masuk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {message && (
              <div className="p-3 bg-blue-50 text-blue-900 text-sm rounded-md border border-blue-200">
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

            {/* Tombol Login */}
            <Button formAction={login} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="underline font-medium">
              Daftar dulu disini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
