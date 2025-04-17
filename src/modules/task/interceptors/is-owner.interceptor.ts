import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Task } from '../entities/task.entity';
import { Pagination } from 'src/common/pagination/dtos/pagination.dto';

@Injectable()
export class IsOwnerInterceptor<T extends Task | Pagination<Task>>
  implements NestInterceptor<T, T>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap(result => {
        if (!user) return;

        if (result instanceof Pagination) {
          for (const task of result.items) {
            this.checkOwnership(task, user.id);
          }
          return;
        }

        this.checkOwnership(result, user.id);
      }),
    );
  }

  private checkOwnership(task: Task, userId: number) {
    const ownerId =
      typeof task.project?.owner === 'object'
        ? task.project.owner.id
        : task.project?.owner;

    if (ownerId !== userId) {
      throw new ForbiddenException('This task does not belong to your project');
    }
  }
}
