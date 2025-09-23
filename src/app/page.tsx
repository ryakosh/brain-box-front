'use client';

import { Send } from "lucide-react"
import { useState } from 'react';
import TextEditor from '@/components/TextEditor';


const MOCK_TOPICS = [
  { id: 1, name: 'Software Development' },
  { id: 2, name: 'Cooking' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'React' },
];

export default function HomePage() {
  const [entryText, setEntryText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null); 
  
  const handleSubmit = () => { 
    if (!entryText.trim() || !selectedTopic) {
        alert("Please write a description and select a topic.");
        return;
    }
    console.log('Submitting entry:', {
        description: entryText,
        topicId: selectedTopic,
    });
    // Here you would typically make an API call
    alert("Entry submitted!");
    setEntryText('');
    setSelectedTopic(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <TextEditor value={entryText} onChange={setEntryText} />
      </div>
       
      <div className="flex h-16">
        <select 
          value={selectedTopic ?? ''}
          onChange={(e) => setSelectedTopic(Number(e.target.value))}
          className="text-lg font-semibold p-2 bg-accent-blue rounded-md m-1 shadow-md"
        >
          <option value="" disabled>Select a Topic...</option>
          {MOCK_TOPICS.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
          ))}
        </select> 
        <button
          type="button"
          onClick={handleSubmit}
          className="flex flex-1 m-1 items-center justify-center text-lg font-semibold bg-accent-orange hover:opacity-90 transition-opacity rounded-md shadow-md"
        >
          <Send size={24} />
          Submit
        </button>
      </div> 
    </div>
  );
}


