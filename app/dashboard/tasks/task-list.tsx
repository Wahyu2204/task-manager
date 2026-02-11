'use client'

import { useState } from "react"
import { archiveTask, bulkArchiveTasks, toggleTask } from "./actions"
import { CheckCircle2, Circle, Archive, CheckSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"

// Tipe data task
type Task = {
  id: number
  title: string
  is_completed: boolean
  priority: string
  created_at: string
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Logic Select
  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Logic Bulk Archive
  const handleBulkArchive = async () => {
    await bulkArchiveTasks(selectedIds)
    setIsSelectionMode(false)
    setSelectedIds([])
  }

  return (
    <div className="space-y-4">
      {isSelectionMode && (
        <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-lg animate-in slide-in-from-top-2 border border-zinc-200">
          <span className="font-medium text-zinc-700">{selectedIds.length} item dipilih</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSelectionMode(false)}>Batal</Button>
            <Button size="sm" onClick={handleBulkArchive} disabled={selectedIds.length === 0}>
              <Archive className="w-4 h-4 mr-2" />
              Arsipkan Terpilih
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {tasks.map((task) => (
          <ContextMenu key={task.id}>
            
            <ContextMenuTrigger>
              <div 
                className={`flex flex-col justify-between h-full p-4 bg-white border rounded-lg shadow-sm transition-all
                  ${selectedIds.includes(task.id) ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:shadow-md'}
                `}
              >
                <div className="flex items-start gap-3">
                  
                  {/* LOGIC GANTI-GANTI ANTARA CHECKBOX vs TOMBOL CEKLIS */}
                  {isSelectionMode ? (
                    <div className="pt-1">
                        <Checkbox 
                        checked={selectedIds.includes(task.id)}
                        onCheckedChange={() => toggleSelect(task.id)}
                        />
                    </div>
                  ) : (
                    <form action={toggleTask}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="currentStatus" value={String(task.is_completed)} />
                        <button type="submit" className="focus:outline-none pt-1">
                            {task.is_completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 hover:text-green-600" />
                            ) : (
                            <Circle className="w-5 h-5 text-zinc-300 hover:text-zinc-500" />
                            )}
                        </button>
                    </form>
                  )}

                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className={`font-medium text-sm truncate ${task.is_completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                    <Badge variant={task.is_completed ? "secondary" : "default"} className={`text-[10px] px-2 py-0.5 ${task.is_completed ? "bg-green-100 text-green-700" : "bg-zinc-900"}`}>
                        {task.is_completed ? "Selesai" : "Pending"}
                    </Badge>
                </div>
              </div>
            </ContextMenuTrigger>

            {/* ISI MENU KLIK KANAN */}
            <ContextMenuContent className="w-48">
              <ContextMenuItem onSelect={() => archiveTask(task.id)}>
                <Archive className="w-4 h-4 mr-2" />
                Archive Task
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={() => {
                setIsSelectionMode(true)
                toggleSelect(task.id)
              }}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Select Multiple...
              </ContextMenuItem>
            </ContextMenuContent>

          </ContextMenu>
        ))}
      </div>
    </div>
  )
}