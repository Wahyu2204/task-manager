import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Ambil User Login (Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Ambil Username dari Tabel 'profiles' (Database)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single();

  // Logic: Kalau ada username pake username, kalau gak ada pake email
  const displayName = profile?.username || user?.email;

  // 3. Ambil Statistik (Sama kayak sebelumnya)
  const { count: totalTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("is_archived", false); // Filter archive

  const { count: completedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("is_completed", true)
    .eq("is_archived", false);

  const pendingCount = (totalTasks || 0) - (completedTasks || 0);

  // 4. Ambil 3 Task Teratas (Belum kelar & Belum diarsip)
  const { data: recentTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_completed", false)
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-10 animate-in fade-in duration-500">
      {/* === HEADER (Gaya Landing Page) === */}
      <div className="text-center space-y-2 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl text-zinc-900">
          Progress Lo Hari Ini
        </h1>
        <p className="text-zinc-500 text-lg">
          {/* Disini kita pake displayName yang udah kita racik diatas */}
          Halo <span className="font-medium text-zinc-900 capitalize">{displayName}</span>! 
          Jangan lupa napas, satu-satu aja ngerjainnya.
        </p>
      </div>

      {/* === CARDS STATISTIK (Centered Grid) === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {/* Card 1: Total */}
        <Card className="shadow-sm border-zinc-200 bg-white/50 hover:bg-white transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Task
            </CardTitle>
            <Circle className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">
              {totalTasks || 0}
            </div>
            <p className="text-xs text-zinc-400">Semua tugas lo</p>
          </CardContent>
        </Card>

        {/* Card 2: Pending */}
        <Card className="shadow-sm border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-600">
              Perlu Dikerjain
            </CardTitle>
            <Clock className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">
              {pendingCount}
            </div>
            <p className="text-xs text-orange-600/80">Semangat cuy!</p>
          </CardContent>
        </Card>

        {/* Card 3: Completed */}
        <Card className="shadow-sm border-green-100 bg-green-50/50 hover:bg-green-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-green-600">
              Selesai
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {completedTasks || 0}
            </div>
            <p className="text-xs text-green-600/80">Mantap, pertahankan!</p>
          </CardContent>
        </Card>
      </div>

      {/* === SECTION: TASK YANG BELUM DIKERJAIN (List Simple) === */}
      <div className="w-full max-w-4xl px-4 space-y-4 text-center md:text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900">
            Task Prioritas (Belum Kelar)
          </h3>
          <Link href="/dashboard/tasks">
            <Button variant="link" className="text-zinc-500">
              Lihat Semua &rarr;
            </Button>
          </Link>
        </div>

        {recentTasks && recentTasks.length > 0 ? (
          <div className="grid gap-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-zinc-700">{task.title}</span>
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-500">
                  Pending
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Tampilan kalau gak ada task pending
          <div className="p-8 border border-dashed border-zinc-200 rounded-lg text-center bg-zinc-50/50">
            <p className="text-zinc-500 mb-4">
              Wih, kerjaan lo beres semua! Atau emang belum bikin?
            </p>
            <Link href="/dashboard/tasks">
              <Button>Bikin Task Baru</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
