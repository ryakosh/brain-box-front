import type { EntryRead } from "@/lib/api/types";
import { Tag } from "lucide-react";
import DOMPurify from "dompurify";

interface EntryCardProps {
  entry: EntryRead;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const cleanDescription = DOMPurify.sanitize(entry.description, {
    ALLOWED_TAGS: ["b"],
  });

  return (
    <div className="w-full bg-bg rounded-md p-4 shadow-md">
      <div
        className="text-fg mb-3 [&>b]:text-accent-green"
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
      <div className="flex items-center gap-2 text-sm text-accent-blue">
        <Tag size={16} />
        <span className="font-semibold">{entry.topic.name}</span>
      </div>
    </div>
  );
}
