import type { TopicReadWithCounts } from "@/lib/api/types";

export const compareTopicByName = (
  a: TopicReadWithCounts,
  b: TopicReadWithCounts,
) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

export const insertTopic = (
  topics: TopicReadWithCounts[],
  newTopic: TopicReadWithCounts,
  compareFn: (a: TopicReadWithCounts, b: TopicReadWithCounts) => number,
): TopicReadWithCounts[] => {
  const updated = [...topics];

  if (newTopic.parent_id === topics[0].parent_id) {
    const index = updated.findIndex((t) => compareFn(newTopic, t) < 0);
    const insertAt = index === -1 ? updated.length : index;

    updated.splice(insertAt, 0, newTopic);
  }

  if (newTopic.parent_id !== null) {
    const parentIndex = updated.findIndex((t) => t.id === newTopic.parent_id);

    if (parentIndex !== -1) {
      const parent = updated[parentIndex];

      parent.children_count += 1;
    }
  }

  return updated;
};
