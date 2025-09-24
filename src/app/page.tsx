"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import TextEditor from "@/components/TextEditor";
import { useToast } from "@/components/Toast";
import { createEntry } from "@/lib/api/services/entries";
import { APIError } from "@/lib/api/errors";
import TopicSelect from "@/components/TopicSelect";
import { TopicRead } from "@/lib/api/types";

const MOCK_TOPICS = [
  { id: 1, name: "Software Development" },
  { id: 2, name: "Cooking" },
  { id: 3, name: "Python" },
  { id: 4, name: "React" },
  { id: 5, name: "Test" },
];

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [topicID, setTopicID] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !topicID) {
      showToast("error", "Please write a description and select a topic.");

      return;
    }

    try {
      await createEntry({ description: description.trim(), topic_id: topicID });
      setDescription("");
      showToast("success");
    } catch (err: unknown) {
      if (err instanceof APIError) {
        showToast("error", err.message);
      } else {
        showToast("error", "An unexpected error occurred");
      }
    }
  };

  const handleTopicSelect = (topic: TopicRead) => {
    if (topic) {
      setTopicID(topic.id);
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="flex-grow">
        <TextEditor value={description} onChange={setDescription} />
      </div>
      <div className="flex h-14 my-2 gap-2">
        <div className="w-2/3">
          <TopicSelect onTopicChange={handleTopicSelect} />
        </div>

        <button
          type="submit"
          className="flex flex-1 h-full m-1 items-center justify-center text-lg font-semibold bg-accent-orange hover:opacity-90 transition-opacity rounded-md shadow-md cursor-pointer"
        >
          <Send size={24} />
          Submit
        </button>
      </div>
    </form>
  );
}
