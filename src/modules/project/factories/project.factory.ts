import { setSeederFactory } from 'typeorm-extension';

import { Project } from '../entities/project.entity';

export const projectFactory = setSeederFactory(Project, faker => {
  const project = new Project();
  project.name = faker.lorem.sentence();
  project.isArchived = faker.datatype.boolean();

  return project;
});
