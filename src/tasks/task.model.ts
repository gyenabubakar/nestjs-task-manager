export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number | null;
}

export enum TaskStatus {
  open = 'open',
  inProgress = 'in-progress',
  done = 'done',
}
