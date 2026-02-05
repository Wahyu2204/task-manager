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
    .eq("is_archived", false) // <--- PENTING: Jangan tampilin yang diarsip
    .order("created_at", { ascending: false });

  if (currentTab === "pending") {
    query = query.eq("is_completed", false);
  }
  if (currentTab === "completed") {
    query = query.eq("is_completed", true);
  }

  const { data: tasks } = await query;

  return (
    <div className="space-y-6">
      {/* 1. JUDUL */}
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
      </div>

      {/* 2. TABS & TOMBOL */}
      <div className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both">
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

      {/* 3. LIST TASK */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 ease-out fill-mode-both">
        {tasks && tasks.length > 0 ? (
          <TaskList tasks={tasks} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50/50">
            <p className="text-zinc-500">Tidak ada task di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
