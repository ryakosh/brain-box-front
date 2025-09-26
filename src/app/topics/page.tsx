'use client';

import TopicNavigator from '@/components/TopicNavigator';

export default function TopicsPage() {   
  return (
    <div className="flex flex-col h-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">
        Manage Topics
      </h1>
      <div className="mx-1">
        <TopicNavigator />
      </div> 
    </div>
  );
}

