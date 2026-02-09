import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // <--- JANGAN LUPA IMPORT INI
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* === BACKGROUND IMAGE AREA === */}
      <div className="absolute inset-0 z-0">
        {/* 1. Gambar Background */}
        <Image
          src="/bg2.jpg" // Pastikan file ada di folder public
          alt="Background Sky"
          fill
          priority
          className="object-cover object-top" // object-top biar langitnya kelihat jelas
          unoptimized
        />
        
        {/* 2. Gradient Overlay (Rahasianya disini) */}
        {/* Ini bikin efek 'fade' dari bening di atas ke putih pekat di bawah */}
        {/* Biar text hitam lo tetep kebaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent" />
      </div>

      {/* === NAMA WEB (POJOK KIRI ATAS) === */}
      <div className="absolute top-8 left-8 z-10 animate-in fade-in slide-in-from-top-10 duration-500 ease-out">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 bg-zinc-900 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            SudoDo.
          </span>
        </Link>
      </div>

      {/* === KONTEN UTAMA (Kasih z-10 biar di atas gambar) === */}
      <div className="relative z-10 w-full max-w-2xl text-center space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <p className="text-sm font-medium text-zinc-600">
            Created By{" "}
            <a
              href="https://wahyu-labs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 font-bold hover:text-blue-600 hover:underline transition-colors"
            >
              Wahyu Andrianto Wibowo
            </a>
          </p>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-zinc-900 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both ease-out drop-shadow-sm">
          Task Manager App 🚀
        </h1>

        <p className="text-zinc-300 text-lg font-medium animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both ease-out max-w-lg mx-auto">
          Kelola tugas lo biar nggak lupa ngerjain skripsi dan project. Daftar
          sekarang gratis!
        </p>

        <div className="justify-center animate-in fade-in slide-in-from-bottom-8 duration-500 delay-500 fill-mode-both ease-out pt-4">
          <Link href="/login">
            <Button
              size="lg"
              className="shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 px-8 text-md font-semibold bg-zinc-900 text-white"
            >
              Login / Register Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}