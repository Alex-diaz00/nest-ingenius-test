import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { ProjectService } from '../services/project.service';
  
  @Injectable()
  export class IsProjectOwnerGuard implements CanActivate {
    constructor(
      private readonly projectService: ProjectService,
      private readonly reflector: Reflector,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const projectId = parseInt(request.params.id, 10);
  
      if (isNaN(projectId)) {
        throw new ForbiddenException('Project not valid');
      }
  
      const project = await this.projectService.getProject(projectId);
  
      if (!project) {
        throw new ForbiddenException('Project not found');
      }
  
      if (project.owner.id !== user.id) {
        throw new ForbiddenException('You dont have access to execute this action');
      }
  
      return true;
    }
  }
  