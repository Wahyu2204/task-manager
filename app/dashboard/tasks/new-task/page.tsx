import { createTask } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Tambahin props searchParams disini
export default async function AddTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  // Ambil error dari URL
  const { error } = await searchParams;

  return (
    <div className="flex flex-col justify-center min-h-[80vh] space-y-10 max-w-2xl mx-auto">
      <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500 ease-out">
        <Link href="/dashboard/tasks">
          <Button
            variant="ghost"
            className="pl-0 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Kembali ke List Task
          </Button>
        </Link>
      </div>

      {/* CARD FORM */}
      <Card className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both shadow-lg">
        <CardHeader>
          <CardTitle>Tambah Task Baru</CardTitle>
          <CardDescription>Tulis apa yang perlu lo kerjain.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* ERROR ALERT */}
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-50 border-red-200 text-red-900 animate-in fade-in zoom-in-95 duration-300"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form action={createTask} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Task</Label>
              <Input
                id="title"
                name="title"
                placeholder="Contoh: Fix bug"
                className="focus-visible:ring-zinc-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Prioritas</Label>
              <select
                name="priority"
                defaultValue="Medium"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Low">Low (Santai)</option>
                <option value="Medium">Medium (Biasa)</option>
                <option value="High">High (Penting Banget)</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Link href="/dashboard/tasks">
                <Button
                  variant="outline"
                  type="button"
                  className="hover:bg-zinc-100"
                >
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                className="shadow-sm hover:shadow-md transition-all"
              >
                Simpan Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
