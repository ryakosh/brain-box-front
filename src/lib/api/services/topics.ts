import api from "../base";
import { APIError } from "../errors";
import type {
  TopicCreate,
  TopicRead,
  TopicReadWithCounts,
  TopicUpdate,
} from "../types";

const base = "/api/topics";

export const createTopic = async (payload: TopicCreate): Promise<TopicRead> => {
  try {
    const res = await api.post<TopicRead>(`${base}/`, payload);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to create topic",
      status: 0,
      original: e,
    });
  }
};

export const getTopic = async (
  topic_id: number,
): Promise<TopicReadWithCounts> => {
  try {
    const res = await api.get<TopicReadWithCounts>(`${base}/${topic_id}`);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to fetch topic",
      status: 0,
      original: e,
    });
  }
};

export const getTopics = async (
  parent_id: number | null = null,
  skip: number = 0,
  limit: number = 100,
): Promise<TopicReadWithCounts[]> => {
  try {
    const res = await api.get<TopicReadWithCounts[]>(`${base}/`, {
      params: { parent_id, skip, limit },
    });

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to fetch topics",
      status: 0,
      original: e,
    });
  }
};

export const searchTopics = async (
  q: string,
  limit: number = 10,
): Promise<TopicRead[]> => {
  try {
    const res = await api.get<TopicRead[]>(`${base}/search/`, {
      params: { q, limit },
    });

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to search topics",
      status: 0,
      original: e,
    });
  }
};

export const updateTopic = async (
  topic_id: number,
  payload: TopicUpdate,
): Promise<TopicRead> => {
  try {
    const res = await api.put<TopicRead>(`${base}/${topic_id}`, payload);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to update topic",
      status: 0,
      original: e,
    });
  }
};

export const deleteTopic = async (topic_id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${topic_id}`);
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to delete topic",
      status: 0,
      original: e,
    });
  }
};
