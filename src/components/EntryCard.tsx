import type { EntryRead } from "@/lib/api/types";
import { Tag } from "lucide-react";

interface EntryCardProps {
  entry: EntryRead;
}

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <div className="w-full bg-bg rounded-md p-4 shadow-md">
      <p className="text-fg mb-3">{entry.description}</p>
      <div className="flex items-center gap-2 text-sm text-accent-blue">
        <Tag size={16} />
        <span className="font-semibold">{entry.topic.name}</span>
      </div>
    </div>
  );
}
