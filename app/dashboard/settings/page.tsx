import { createClient } from "@/lib/supabase/server";
import { updateProfile, updateEmail, updatePassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const { message, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single();

  return (
    // TAMBAHAN 1: 'mx-auto' biar container ini posisinya di tengah layar
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500">Kelola preferensi akun lo disini.</p>
      </div>

      {/* NOTIFIKASI */}
      {message && (
        <Alert className="bg-green-50 border-green-200 text-green-900">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Sukses</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* TAMBAHAN 2: 
         - Ganti 'items-center justify-center' jadi 'flex flex-col gap-6'
         - Ini bikin kartu numpuk ke bawah rapi dengan jarak 24px (gap-6)
      */}
      <div className="flex flex-col gap-6">
        
        {/* === CARD 1: PROFILE === */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Saya</CardTitle>
            <CardDescription>
              Nama ini yang bakal muncul di dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="grid gap-2 w-full max-w-md">
                <Label htmlFor="username">Username / Nama Panggilan</Label>
                <Input
                  name="username"
                  defaultValue={profile?.username || ""}
                  placeholder="Masukan nama..."
                />
              </div>
              <Button type="submit">Simpan Profil</Button>
            </form>
          </CardContent>
        </Card>

        {/* === CARD 2: EMAIL === */}
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>
              Ganti email lo. Perlu verifikasi ulang ya.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateEmail} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="grid gap-2 w-full max-w-md">
                <Label htmlFor="email">Email Baru</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={user?.email || ""}
                />
              </div>
              <Button type="submit" variant="secondary">
                Update Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* === CARD 3: PASSWORD === */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Ubah password kalau lo ngerasa gak aman.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePassword} className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input name="confirmPassword" type="password" required />
              </div>
              <div className="pt-2">
                 <Button type="submit" variant="destructive">
                    Ganti Password
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}