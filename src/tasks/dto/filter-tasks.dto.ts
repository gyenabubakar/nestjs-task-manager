import { TaskStatus } from '#tasks/task.model';

export default class FilterTasksDto {
  status?: TaskStatus;
  search?: string;
}
