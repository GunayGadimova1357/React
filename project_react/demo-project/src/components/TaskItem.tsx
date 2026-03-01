import { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";

export function TaskItem({ task }: { task: { id: number; title: string } }) {
  const [done, setDone] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 border rounded-md bg-zinc-900 text-white">
      <Checkbox checked={done} onCheckedChange={(val) => setDone(!!val)} />
      <span className={done ? "line-through text-gray-400" : ""}>{task.title}</span>
    </div>
  );
}