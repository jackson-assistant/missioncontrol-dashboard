import { Badge } from "@/components/ui/badge";
import type { Task } from "@/lib/data";

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-600 dark:bg-zinc-700 dark:hover:shadow-zinc-900/50">
      <h3 className="text-sm font-semibold leading-tight text-foreground">
        {task.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-dim">
        {task.description}
      </p>
      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-muted px-1.5 py-0 text-[10px] font-normal text-dim"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
