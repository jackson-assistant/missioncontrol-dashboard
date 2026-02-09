import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAgentById } from "@/lib/data";
import type { Task } from "@/lib/data";

export function TaskCard({ task }: { task: Task }) {
  const assignee = task.assignee ? getAgentById(task.assignee) : null;

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-2">
        {task.status === "inbox" && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
        )}
        <h3 className="text-sm font-semibold leading-tight text-stone-800">
          {task.title}
        </h3>
      </div>

      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500">
        {task.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee && (
            <Avatar size="sm">
              <AvatarFallback
                style={{ backgroundColor: assignee.color, color: "white" }}
                className="text-[9px] font-bold"
              >
                {assignee.avatar}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-[10px] text-stone-400">{task.createdAt}</span>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-stone-100 px-1.5 py-0 text-[10px] font-normal text-stone-500"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
