import { ChevronLeft, ChevronRight, TrashIcon } from "lucide-react";
import type { TopicReadWithCounts } from "@/lib/api/types";

interface TopicNavigatorProps {
  topics: TopicReadWithCounts[];
  title: string;
  onTopicClick: (topics: TopicReadWithCounts) => void;
  onBackClick: () => void;
  onDelete: (topic: TopicReadWithCounts) => void;
}

export default function TopicNavigator({
  topics,
  title,
  onTopicClick,
  onBackClick,
  onDelete,
}: TopicNavigatorProps) {
  const renderContent = () => {
    if (topics.length === 0) {
      return <p className="text-center text-fg-muted p-6">No subtopics.</p>;
    }
    return (
      <ul className="space-y-1 overflow-auto h-full">
        {topics.map((topic) => {
          const isClickable = (topic.children_count ?? 0) > 0;

          return (
            <li key={topic.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onTopicClick(topic)}
                disabled={!isClickable}
                className={`w-full flex items-center justify-between text-left p-3 rounded-md transition-colors ${
                  isClickable
                    ? "cursor-pointer hover:bg-bg-soft"
                    : "cursor-default"
                }`}
              >
                <span className="text-fg">{topic.name}</span>
                {isClickable && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-fg-muted">
                      {topic.children_count}
                    </span>
                    <ChevronRight size={18} className="text-fg-muted" />
                  </div>
                )}
              </button>
              <button
                type="button"
                className="text-accent-red cursor-pointer"
                onClick={() => onDelete(topic)}
              >
                <TrashIcon size={20} />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={
        "flex flex-col bg-bg-hard rounded-md shadow-md h-full w-full mx-auto"
      }
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {topics.length > 0 && topics[0].parent_id && (
            <button
              type="button"
              onClick={() => onBackClick()}
              className="p-1 cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="text-fg-muted" size={20} />
            </button>
          )}
          <h2 className="text-lg font-bold text-fg">{title}</h2>
        </div>
        {topics.length && (
          <span className="text-sm font-medium bg-fg-soft text-fg-muted px-2 py-1 rounded-md">
            {topics.length}
          </span>
        )}
      </div>

      <div className="p-2 w-full min-h-0 flex-1">{renderContent()}</div>
    </div>
  );
}
