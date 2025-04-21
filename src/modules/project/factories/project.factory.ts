import { setSeederFactory } from 'typeorm-extension';
import { fakerEN as faker } from '@faker-js/faker';
import { Project } from '../entities/project.entity';

export const projectFactory = setSeederFactory(Project, () => {
  const project = new Project();
  project.name = faker.lorem.sentence();
  project.isArchived = faker.datatype.boolean();

  return project;
});
