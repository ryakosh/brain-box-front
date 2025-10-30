import { Send } from "lucide-react";
import { useState } from "react";
import TextEditor from "@/components/TextEditor";
import { useToast } from "@/components/Toast";
import { createEntry } from "@/lib/api/services/entries";
import TopicSelect from "@/components/TopicSelect";
import type { EntryCreate, TopicRead } from "@/lib/api/types";
import { useMutation } from "@tanstack/react-query";

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [topicID, setTopicID] = useState<number | null>(null);
  const { showToast } = useToast();

  const createEntryMutation = useMutation({
    mutationFn: (entry: EntryCreate) => createEntry(entry),
    onSuccess: () => {
      showToast({ id: "create-entry", mode: "success" });
      setDescription("");
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !topicID) {
      showToast({
        id: "validation-error",
        mode: "error",
        message: "Describe what you learned and choose a topic",
      });

      return;
    }

    createEntryMutation.mutate({ description, topic_id: topicID });
  };

  const handleTopicSelect = (topic: TopicRead | null) => {
    if (topic) {
      setTopicID(topic.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">
        What's on your mind?
      </h1>
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        <div className="flex-grow m-1">
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
    </div>
  );
}
