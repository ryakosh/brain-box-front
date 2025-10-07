"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import type { TopicRead } from "@/lib/api/types";
import { searchTopics } from "@/lib/api/services/topics";
import { useToast } from "@/components/Toast";
import { APIError } from "@/lib/api/errors";

interface TopicSelectProps {
  onTopicChange: (topic: TopicRead | null) => void;
}

export default function TopicSelect({ onTopicChange }: TopicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TopicRead[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicRead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setIsLoading(false);
      setSearchResults([]);

      return;
    }

    setIsLoading(true);

    const handler = setTimeout(async () => {
      try {
        const results = await searchTopics(searchQuery);

        setSearchResults(results);
      } catch (err: unknown) {
        if (err instanceof APIError) {
          showToast({ id: "api-error", mode: "error", message: err.message });
        } else {
          showToast({
            id: "unexpected-error",
            mode: "error",
            message: "An unexpected error occurred",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, showToast]);

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
    setSearchResults([]);
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

          <div className="max-h-60 overflow-y-auto">
            {searchResults.length > 0 && (
              <ul className="space-y-1">
                {searchResults.map((topic) => (
                  <li key={topic.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(topic)}
                      className="w-full text-left mt-1 p-2 rounded-md hover:opacity-70 cursor-pointer"
                    >
                      {topic.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {searchQuery.length >= 2 &&
              !isLoading &&
              searchResults.length === 0 && (
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
