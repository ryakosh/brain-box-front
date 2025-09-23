"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

// Mock data - in a real app, this would come from an API
const initialTopics = [
  { id: 1, name: "Software Development", parentId: null },
  { id: 2, name: "Cooking", parentId: null },
  { id: 3, name: "Python", parentId: 1 },
  { id: 4, name: "React", parentId: 1 },
];

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState(initialTopics);
  const [newTopicName, setNewTopicName] = useState("");
  const [parentTopic, setParentTopic] = useState<string>("");

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic = {
      id: Date.now(),
      name: newTopicName,
      parentId: parentTopic ? Number(parentTopic) : null,
    };

    setTopics([...topics, newTopic]);
    setNewTopicName("");
    setParentTopic("");
  };

  return (
    <div className="p-4 h-screen flex flex-col bg-soft">
      <header className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-hard"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-fg">Manage Topics</h1>
      </header>

      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {topics
          .filter((t) => !t.parentId)
          .map((topic) => (
            <div key={topic.id} className="p-4 rounded-lg bg-bg border">
              <p className="font-semibold text-fg">{topic.name}</p>
              {topics.filter((t) => t.parentId === topic.id).length > 0 && (
                <ul className="pl-4 mt-2 space-y-2 border-l ml-2">
                  {topics
                    .filter((t) => t.parentId === topic.id)
                    .map((child) => (
                      <li key={child.id} className="text-sm text-fg-muted">
                        {child.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
      </div>

      <form
        onSubmit={handleAddTopic}
        className="mt-6 p-4 rounded-xl bg-bg border shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-3 text-fg">Add New Topic</h2>
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="New topic name"
          className="w-full p-3 rounded-lg mb-3 bg-bg-hard border border-ui-border focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
        <div className="relative">
          <select
            value={parentTopic}
            onChange={(e) => setParentTopic(e.target.value)}
            className="w-full appearance-none p-3 rounded-lg mb-4 bg-ui-hard border border-ui-border focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">No Parent (Root Topic)</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 rounded-lg font-bold text-text-inverted bg-accent-green hover:opacity-90 transition-opacity"
        >
          Add Topic
        </button>
      </form>
    </div>
  );
}
