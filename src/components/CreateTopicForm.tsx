"use client";

import { useState, useRef } from "react";
import { Plus, Send } from "lucide-react";
import type { TopicCreate, TopicRead } from "@/lib/api/types";
import TopicSelect from "@/components/TopicSelect";
import { useOnClickOutside } from "@/lib/hooks";

interface CreateTopicFormProps {
  onSubmit?: (topicCreate: TopicCreate) => void;
}

export default function CreateTopicForm({ onSubmit }: CreateTopicFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [selectedParent, setSelectedParent] = useState<TopicRead | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(formRef, () => {
    if (isFormVisible) {
      setIsFormVisible(false);
    }
  });

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
    if (!topicName.trim()) {
      return;
    }

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
    <div ref={formRef} className="relative w-full h-full">
      {isFormVisible && (
        <div className="absolute bottom-full left-0 right-0 mb-1 p-4 bg-bg rounded-md shadow-md">
          <h3 className="font-bold text-lg mb-4 text-fg">New Topic</h3>
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 h-14 bg-accent-orange text-lg font-semibold rounded-md hover:bg-accent-orange/90 transition-all duration-200 cursor-pointer"
      >
        <ButtonIcon size={20} />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}
