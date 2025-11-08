import TopicNavigator from "@/components/TopicNavigator";
import CreateTopicForm from "@/components/CreateTopicForm";
import type { TopicCreate, TopicReadWithCounts } from "@/lib/api/types";
import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopics,
} from "@/lib/api/services/topics";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";

export default function TopicsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const parentId = parseInt(id ?? "", 10) || null;

  const { data: parentTopic, ...parentTopicQuery } = useQuery({
    queryKey: ["topics", parentId],
    queryFn: ({ queryKey }) => getTopic(queryKey[1] as number),
    enabled: !!parentId && !Number.isNaN(parentId),
  });
  const { data: subTopics, ...subTopicsQuery } = useQuery({
    queryKey: ["subTopics", parentId],
    queryFn: ({ queryKey }) => getTopics(queryKey[1] as number | null),
  });

  const createTopicMutation = useMutation({
    mutationFn: (topicCreate: TopicCreate) => createTopic(topicCreate),
    onSuccess: async (topic) => {
      await queryClient.invalidateQueries({
        queryKey: ["subTopics", topic.parent_id],
      });

      showToast({ id: "create-topic", mode: "success" });
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
  });
  const deleteTopicMutation = useMutation({
    mutationFn: (topic: TopicReadWithCounts) => deleteTopic(topic.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subTopics", variables.parent_id],
      });

      showToast({ id: "delete-topic", mode: "success" });
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
    gcTime: Infinity,
  });

  const handleTopicClick = (topic: TopicReadWithCounts) => {
    navigate(`/topics/${topic.id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (topicCreate: TopicCreate) => {
    if (!topicCreate.name.trim()) {
      showToast({
        id: "create-topic",
        mode: "error",
        message: "Please name your topic",
      });

      return;
    }

    topicCreate.parent_id = parentId;
    createTopicMutation.mutate(topicCreate);
  };

  const handleDelete = async (topic: TopicReadWithCounts) => {
    const accepted = await confirm({
      title: "Delete this topic?",
      description:
        "This will permanently delete the topic and all of its entries, including its subtopics and their entries.",
      confirmLabel: "Delete",
      rejectLabel: "Cancel",
    });

    if (accepted) {
      deleteTopicMutation.mutate(topic);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-xl md:text-2xl mx-1 my-3 text-fg">
        Manage Topics
      </h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <div className="flex flex-col bg-bg-hard rounded-md shadow-md h-full overflow-auto w-full mx-auto">
          {parentTopicQuery.isError && subTopicsQuery.isError && (
            <PageError>
              {(parentTopicQuery.error || subTopicsQuery.error).message}
            </PageError>
          )}
          {parentTopicQuery.isLoading && subTopicsQuery.isLoading && (
            <PageLoading />
          )}
          {subTopicsQuery.isSuccess && (
            <TopicNavigator
              parentTopic={parentTopic ?? null}
              topics={subTopics ?? []}
              showBack={parentId !== null}
              onTopicClick={handleTopicClick}
              onBackClick={handleBackClick}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      <div className="my-1 mx-1">
        <CreateTopicForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
