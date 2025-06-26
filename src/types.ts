export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

export interface Task {
  id: number;
  text: string;
  date: Date | null;
  priority: string | null;
  createdAt: string;
  done: boolean;
}
