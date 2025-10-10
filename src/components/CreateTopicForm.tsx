"use client";

import { useState } from "react";
import { Plus, Send, X } from "lucide-react";
import type { TopicCreate, TopicRead } from "@/lib/api/types";
import TopicSelect from "@/components/TopicSelect";

interface CreateTopicFormProps {
  onSubmit?: (topicCreate: TopicCreate) => void;
}

export default function CreateTopicForm({ onSubmit }: CreateTopicFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [selectedParent, setSelectedParent] = useState<TopicRead | null>(null);

  const resetForm = () => {
    setTopicName("");
    setSelectedParent(null);
  };

  const handleToggleForm = () => {
    if (isFormVisible) {
      handleSubmit();
    } else {
      setIsFormVisible(true);
    }
  };

  const handleSubmit = async () => {
    const topicCreate: TopicCreate = {
      name: topicName.trim(),
      parent_id: selectedParent?.id ?? null,
    };

    setIsFormVisible(false);
    resetForm();
    onSubmit?.(topicCreate);
  };

  const buttonText = isFormVisible ? "Submit" : "Create Topic";
  const ButtonIcon = isFormVisible ? Send : Plus;

  return (
    <div className="relative w-full h-full">
      {isFormVisible && (
        <div className="absolute bottom-full left-0 right-0 mb-1 p-4 bg-bg rounded-md shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-fg">New Topic</h3>
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="cursor-pointer text-fg-muted"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter topic name..."
              className="w-full bg-bg-hard rounded-md px-3 py-2 text-fg outline-none"
            />
            <TopicSelect onTopicChange={setSelectedParent} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleForm}
        className="w-full flex items-center justify-center gap-1 px-4 py-3 h-14 bg-accent-orange text-lg font-semibold rounded-md hover:bg-accent-orange/90 transition-all duration-200 cursor-pointer"
      >
        <ButtonIcon size={20} />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}
