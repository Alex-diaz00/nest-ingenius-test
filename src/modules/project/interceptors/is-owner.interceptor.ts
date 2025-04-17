import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Project } from '../entities/project.entity';
import { Pagination } from 'src/common/pagination/dtos/pagination.dto';

@Injectable()
export class IsOwnerInterceptor<T extends Project | Pagination<Project>>
  implements NestInterceptor<T, T>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap(project => {
        if (!user || project instanceof Pagination) return;

        const userId =
          typeof project.owner === 'object' ? project.owner.id : project.owner;
        const isOwner = userId === user.id;

        if (!isOwner) {
          throw new ForbiddenException(`Project does not belong to you`);
        }
      }),
    );
  }
}
