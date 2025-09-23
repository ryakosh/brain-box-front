import api from "../base";
import { APIError } from "../errors";
import type { EntryCreate, EntryRead, EntryUpdate } from "../types";

const base = "/api/entries";

export const createEntry = async (payload: EntryCreate): Promise<EntryRead> => {
  try {
    const res = await api.post<EntryRead>(`${base}/`, payload);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to create entry",
      status: 0,
      original: e,
    });
  }
};

export const getEntry = async (entry_id: number): Promise<EntryRead> => {
  try {
    const res = await api.get<EntryRead>(`${base}/${entry_id}`);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to fetch entry",
      status: 0,
      original: e,
    });
  }
};

export const updateEntry = async (
  entry_id: number,
  payload: EntryUpdate,
): Promise<EntryRead> => {
  try {
    const res = await api.put<EntryRead>(`${base}/${entry_id}`, payload);

    return res.data;
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to update entry",
      status: 0,
      original: e,
    });
  }
};

export const deleteEntry = async (entry_id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${entry_id}`);
  } catch (e) {
    if (e instanceof APIError) throw e;

    throw new APIError({
      message: "Failed to delete entry",
      status: 0,
      original: e,
    });
  }
};
