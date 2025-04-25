import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { TaskService } from "../services/task.service";

@Injectable()
export class IsTaskAssigneeGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const taskId = parseInt(request.params.id, 10);

    const task = await this.taskService.getTask(taskId);
    const isAssigned = task.assignees?.some((assignee) => assignee.id === user.id);

    if (!isAssigned) {
      throw new ForbiddenException('This task is not assigned to you.');
    }

    return true;
  }
}
