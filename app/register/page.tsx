import { signup } from "@/app/login/actions"; // Import dari actions yang sama
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

export default async function RegisterPage({
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
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Bikin akun dulu biar bisa mulai catet task.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {message && (
              <div className="p-3 bg-red-100 text-red-900 text-sm rounded-md border border-red-200">
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

            {/* Tombol Register */}
            <Button formAction={signup} className="w-full">
              Buat Akun
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Udah punya akun?{" "}
            <Link href="/login" className="underline font-medium">
              Login disini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
