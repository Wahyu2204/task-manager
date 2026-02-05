import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation"; // Import redirect
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // LOGIC REDIRECT: Kalau user ada, langsung lempar ke dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
      {/* === NAMA WEB (POJOK KIRI ATAS) === */}
      <div className="absolute top-8 left-8 animate-in fade-in slide-in-from-top-10 duration-500 ease-out">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {/* Logo Kotak Hitam Simpel */}
          <div className="h-8 w-8 bg-zinc-900 rounded-md flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {/* Nama Web */}
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            SudoDo.
          </span>
        </Link>
      </div>

      {/* === KONTEN UTAMA === */}
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <p className="text-sm font-medium text-zinc-500">
            Created By{" "}
            <a
              href="https://wahyu-labs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 hover:text-blue-600 hover:underline transition-colors"
            >
              Wahyu Andrianto Wibowo
            </a>
          </p>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-zinc-900 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both ease-out">
          Task Manager App 🚀
        </h1>

        <p className="text-zinc-500 text-lg animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both ease-out">
          Kelola tugas lo biar nggak lupa ngerjain skripsi dan project. Daftar
          sekarang gratis!
        </p>

        <div className="justify-center animate-in fade-in slide-in-from-bottom-8 duration-500 delay-500 fill-mode-both ease-out">
          <Link href="/login">
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Login / Register Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
