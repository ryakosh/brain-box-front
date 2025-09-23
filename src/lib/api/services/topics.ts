import api from "../base";
import { APIError } from "../errors";
import type {
  TopicCreate,
  TopicRead,
  TopicReadWithDetails,
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
): Promise<TopicReadWithDetails> => {
  try {
    const res = await api.get<TopicReadWithDetails>(`${base}/${topic_id}`);

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
