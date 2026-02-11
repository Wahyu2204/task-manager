"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Armchair,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Data Visual
const MODE_VISUALS = {
  work: {
    label: "Fokus",
    color: "bg-red-50 border-red-200 text-red-900",
    icon: Brain,
  },
  shortBreak: {
    label: "Rehat Dikit",
    color: "bg-green-50 border-green-200 text-green-900",
    icon: Coffee,
  },
  longBreak: {
    label: "Rehat Panjang",
    color: "bg-blue-50 border-blue-200 text-blue-900",
    icon: Armchair,
  },
};

export default function PomodoroPage() {
  // STATE DURASI (Default values)
  const [durations, setDurations] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // State Timer
  const [mode, setMode] = useState<keyof typeof MODE_VISUALS>("work");
  const [timeLeft, setTimeLeft] = useState(durations.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logic Timer Jalan
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Cek apakah detik berikutnya bakal jadi 0?
          if (prevTime <= 1) {
            // Kalau iya, matikan timer SEKARANG
            clearInterval(interval);
            setIsActive(false);

            // Bunyiin alert disini (biar gak error render)
            // Kasih timeout dikit biar browser render angka 0 dulu baru muncul alert
            setTimeout(() => alert("Waktu habis! Ganti mode yuk."), 100);

            return 0;
          }
          // Kalau belum 0, kurangi 1 detik
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]); // Dependency cuma butuh isActive aja

  // Logic Update Judul Tab
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    if (isActive) {
      document.title = `${minutes}:${seconds} - ${MODE_VISUALS[mode].label}`;
    } else {
      document.title = "Pomodoro Timer";
    }
  }, [timeLeft, isActive, mode]);

  // Fungsi Ganti Mode
  const switchMode = (newMode: keyof typeof MODE_VISUALS) => {
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60); // Ambil waktu dari state durations
    setIsActive(false);
  };

  // Fungsi Reset Timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  };

  // Fungsi Save Settings
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newDurations = {
      work: Number(formData.get("work")) || 25,
      shortBreak: Number(formData.get("shortBreak")) || 5,
      longBreak: Number(formData.get("longBreak")) || 15,
    };

    setDurations(newDurations);

    // Kalau mode yang lagi aktif durasinya berubah, langsung update timer-nya
    if (!isActive) {
      setTimeLeft(newDurations[mode] * 60);
    }

    setIsSettingsOpen(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const CurrentIcon = MODE_VISUALS[mode].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 relative">
      {/* 1. HEADER & SETTINGS */}
      <div className="text-center space-y-2 relative w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Pomodoro Timer
        </h1>
        <p className="text-zinc-500">Sesuaikan ritme kerja lo.</p>

        {/* TOMBOL SETTINGS */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-1 right-0 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all hover:rotate-45"
            >
              <Settings2 className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pengaturan Timer</DialogTitle>
              <DialogDescription>
                Atur durasi (dalam menit) sesuai gaya kerja lo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveSettings} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work" className="text-right">
                  Fokus
                </Label>
                <Input
                  id="work"
                  name="work"
                  type="number"
                  defaultValue={durations.work}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shortBreak" className="text-right">
                  Rehat Kecil
                </Label>
                <Input
                  id="shortBreak"
                  name="shortBreak"
                  type="number"
                  defaultValue={durations.shortBreak}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longBreak" className="text-right">
                  Rehat Besar
                </Label>
                <Input
                  id="longBreak"
                  name="longBreak"
                  type="number"
                  defaultValue={durations.longBreak}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. TOMBOL GANTI MODE */}
      <div className="flex p-1 bg-zinc-100 rounded-lg border border-zinc-200 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both">
        {(Object.keys(MODE_VISUALS) as Array<keyof typeof MODE_VISUALS>).map(
          (key) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
                mode === key
                  ? "bg-white text-black shadow-sm ring-1 ring-black/5 scale-105"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50",
              )}
            >
              {MODE_VISUALS[key].label}
            </button>
          ),
        )}
      </div>

      {/* 3. KARTU TIMER UTAMA */}
      <div
        className={cn(
          "relative w-full max-w-sm p-8 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 delay-300 ease-out fill-mode-both",
          MODE_VISUALS[mode],
        )}
      >
        {/* Icon Indikator Mode */}
        <div
          className={cn(
            "p-3 rounded-full border-2 border-current bg-white shadow-sm transition-colors duration-300",
            mode === "work"
              ? "text-red-600"
              : mode === "shortBreak"
                ? "text-green-600"
                : "text-blue-600",
          )}
        >
          <CurrentIcon className="w-8 h-8" />
        </div>

        {/* Angka Waktu */}
        <div className="text-8xl font-black tracking-tighter tabular-nums text-zinc-900 drop-shadow-sm">
          {formatTime(timeLeft)}
        </div>

        {/* Kontrol (Play/Pause/Reset) */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "h-14 px-8 rounded-full border-2 border-black text-lg font-bold transition-all active:scale-95",
              isActive
                ? "bg-white text-black hover:bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[2px]"
                : "bg-black text-white hover:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1",
            )}
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-14 w-14 rounded-full border-2 border-black bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
