export interface TopicCreate {
  name: string;
  parent_id?: number | null;
}

export interface TopicRead {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface TopicReadWithDetails extends TopicRead {
  children?: TopicRead[];
}

export interface TopicUpdate {
  name?: string | null;
  parent_id?: number | null;
}

export interface EntryCreate {
  description: string;
  topic_id: number;
}

export interface EntryRead {
  id: number;
  description: string;
  topic: TopicRead;
}

export interface EntryUpdate {
  description?: string | null;
  topic_id?: number | null;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}
