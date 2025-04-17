import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Observable } from 'rxjs';
  import { Task } from '../entities/task.entity';
  
  @Injectable()
  export class IsTaskAssigneeInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const method = request.method;
  
      const isModifying = ['PUT', 'PATCH', 'DELETE'].includes(method);
      if (!isModifying) return next.handle();
  
      const user = request.user;
      const task: Task = request.task || request.params.task;
  
      if (!task) {
        throw new ForbiddenException('No se encontró la tarea para verificar la asignación.');
      }
  
      const isAssigned = task.assignees?.some((assignee) => assignee.id === user.id);
      if (!isAssigned) {
        throw new ForbiddenException('Solo puedes modificar tareas asignadas a ti.');
      }
  
      return next.handle();
    }
  }
  