import { Injectable, PipeTransform } from '@nestjs/common';

import { ProjectService } from '../services/project.service';

@Injectable()
export class ParseProjectPipe implements PipeTransform {
  constructor(private readonly projectService: ProjectService) {}

  transform(value: number) {
    return this.projectService.getProject(value);
  }
}
