import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // TabsContent apus aja kalo gak dipake
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TaskList } from "./task-list";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status: string }>;
}) {
  const { status } = await searchParams;
  const currentTab = status || "all"; 

  const supabase = await createClient();

  // 1. Logic Query Database (DITAMBAH FILTER ARCHIVE)
  let query = supabase
    .from("tasks")
    .select("*")
    .eq('is_archived', false) // <--- PENTING: Jangan tampilin yang diarsip
    .order("created_at", { ascending: false });

  if (currentTab === "pending") {
    query = query.eq("is_completed", false);
  }
  if (currentTab === "completed") {
    query = query.eq("is_completed", true);
  }

  const { data: tasks } = await query;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
      </div>

      {/* === TABS FILTER & BUTTON (SAMA PERSIS KAYA KODE LO) === */}
      <div className="flex items-center justify-between gap-4">
        <Tabs defaultValue={currentTab} className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3">
            <Link href="/dashboard/tasks">
              <TabsTrigger value="all" className="w-full">
                All Tasks
              </TabsTrigger>
            </Link>

            <Link href="/dashboard/tasks?status=pending">
              <TabsTrigger value="pending" className="w-full">
                Pending
              </TabsTrigger>
            </Link>

            <Link href="/dashboard/tasks?status=completed">
              <TabsTrigger value="completed" className="w-full">
                Completed
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        <div className="shrink-0">
          <Link href="/dashboard/tasks/new-task">
            <Button>Add New Task</Button>
          </Link>
        </div>
      </div>

      {/* === LIST TASK (DIGANTI PAKE COMPONENT BARU) === */}
      {tasks && tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-zinc-500">Tidak ada task di kategori ini.</p>
        </div>
      )}
    </div>
  );
}