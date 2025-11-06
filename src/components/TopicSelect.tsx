import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import type { TopicRead } from "@/lib/api/types";

interface TopicSelectProps {
  onTopicChange: (topic: TopicRead | null) => void;
  topics: TopicRead[];
}

export default function TopicSelect({
  onTopicChange,
  topics,
}: TopicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicRead | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTopics = useMemo(() => {
    const lowerCaseQuery = searchQuery.trim().toLowerCase();
    let results: TopicRead[] = [];

    setIsLoading(true);

    if (lowerCaseQuery.length >= 2) {
      results = topics.filter((topic) =>
        topic.name.toLowerCase().includes(lowerCaseQuery),
      );
    }
    setIsLoading(false);

    return results;
  }, [topics, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (topic: TopicRead) => {
    onTopicChange(topic);
    setSelectedTopic(topic);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="relative w-full h-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full h-full flex items-center justify-between text-lg font-semibold p-2 bg-accent-blue rounded-md m-1 shadow-md text-left cursor-pointer"
      >
        <span>{selectedTopic ? selectedTopic.name : "Select a Topic..."}</span>
        <ChevronDown size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full ml-1 mb-2 p-2 bg-accent-blue shadow-md rounded-md origin-bottom">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a topic..."
              className="w-full bg-bg text-lg rounded-md p-2 pl-10 focus:outline-none"
            />
            {isLoading && (
              <Loader2
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted animate-spin"
              />
            )}
          </div>

          <div className="max-h-60 overflow-y-auto mt-1">
            {filteredTopics.length > 0 && (
              <ul className="space-y-1">
                {filteredTopics.map((topic) => (
                  <li key={topic.id} className="mt-1 px-0.5">
                    <button
                      type="button"
                      onClick={() => handleSelect(topic)}
                      className="w-full text-left bg-bg p-1 rounded-md hover:opacity-70 cursor-pointer"
                    >
                      <div className="flex-inline items-center text-xs w-fit px-2 rounded-sm text-accent-yellow uppercase">
                        {topic.parent?.name ?? "ROOT"}
                      </div>
                      <div className="overflow-x-auto">{topic.name}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {searchQuery.length >= 2 &&
              !isLoading &&
              filteredTopics.length === 0 && (
                <p className="p-2 text-sm">
                  No topics found for "{searchQuery}"
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
