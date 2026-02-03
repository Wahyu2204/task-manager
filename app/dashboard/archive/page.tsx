import { createClient } from "@/lib/supabase/server";
import { restoreTask, deleteTaskPermanently } from "../tasks/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Archive
      </h1>
      <p className="text-zinc-500">
        Task disini gak bakal muncul di dashboard utama.
      </p>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
          >
            <span className="font-medium text-zinc-600 line-through">
              {task.title}
            </span>

            <div className="flex gap-2">
              {/* Tombol Restore */}
              <form action={restoreTask.bind(null, task.id)}>
                <Button
                  size="sm"
                  variant="outline"
                  title="Kembalikan ke Dashboard"
                >
                  <RefreshCcw className="w-4 h-4 text-green-600" />
                </Button>
              </form>

              {/* Tombol Hapus Permanen */}
              <form action={deleteTaskPermanently.bind(null, task.id)}>
                <Button size="sm" variant="destructive" title="Hapus Selamanya">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}

        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg">
            <p className="text-zinc-500">Tidak ada archive disini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
