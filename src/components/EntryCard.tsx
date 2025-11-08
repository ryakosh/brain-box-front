import type { EntryRead } from "@/lib/api/types";
import { Tag, TrashIcon } from "lucide-react";
import DOMPurify from "dompurify";
import React, { FormEvent } from "react";

interface EntryCardProps {
  entry: EntryRead;
  onClick: (entry: EntryRead) => void;
  onDelete: (entry: EntryRead) => void;
}

const EntryCard = React.memo(({ entry, onClick, onDelete }: EntryCardProps) => {
  const cleanDescription = DOMPurify.sanitize(entry.description, {
    ALLOWED_TAGS: ["b"],
  });

  const handleDelete = (e: FormEvent) => {
    e.stopPropagation();
    onDelete(entry);
  };

  return (
    <div
      onClick={() => onClick(entry)}
      className="w-full bg-bg rounded-md p-4 shadow-md cursor-pointer"
    >
      <div
        className="text-fg mb-3 [&>b]:text-accent-green text-md md:text-lg"
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-md md:text-lg text-accent-blue">
          <Tag size={20} />
          <span className="font-semibold">{entry.topic.name}</span>
        </div>
        <button
          type="button"
          className="text-accent-red cursor-pointer"
          onClick={handleDelete}
        >
          <TrashIcon size={20} />
        </button>
      </div>
    </div>
  );
});

export default EntryCard;
