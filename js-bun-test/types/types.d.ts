export type Author = {
  key: string | null;
  name: string | null;
};

export type Book = {
  key: string;
  title: string;
  cover_id: number;
  subject: string[];
  authors: Author[];
};

export type Profiler = {
  start_time: bigint;
  end_time: bigint;
  end_times: bigint[];
};

export type Subject_T = {
  subject_id: string;
};
export type Author_T = {
  author_id: string;
};
