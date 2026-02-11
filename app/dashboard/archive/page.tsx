import { createClient } from "@/lib/supabase/server";
import { restoreTask, deleteTaskPermanently } from "../tasks/actions";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2 } from "lucide-react";

export default async function ArchivePage() {
  const supabase = await createClient();

  // Ambil cuma yang is_archived = true
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_archived", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Archive
        </h1>
        <p className="text-zinc-500">
          Task disini gak bakal muncul di dashboard utama.
        </p>
      </div>

      {/* LIST ARCHIVE */}
      <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg opacity-75 hover:opacity-100 hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            {/* Judul Task (Coret) */}
            <span className="font-medium text-zinc-600 line-through decoration-zinc-400">
              {task.title}
            </span>

            <div className="flex gap-2">
              {/* Tombol Restore */}
              <form action={restoreTask.bind(null, task.id)}>
                <Button
                  size="sm"
                  variant="outline"
                  title="Kembalikan ke Dashboard"
                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </form>

              {/* Tombol Hapus Permanen */}
              <form action={deleteTaskPermanently.bind(null, task.id)}>
                <Button
                  size="sm"
                  variant="destructive"
                  title="Hapus Selamanya"
                  className="hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}

        {/* State Kalau Kosong */}
        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50/30">
            <p className="text-zinc-500">Tidak ada archive disini. Bersih!</p>
          </div>
        )}
      </div>
    </div>
  );
}
