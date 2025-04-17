import { IntegreSQLClient } from '@devoxa/integresql-client';
import { faker } from '@faker-js/faker';
import { build, perBuild } from '@jackfranklin/test-data-bot';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '../src/app.module';
import { appDataSource as dataSource } from '../src/common/modules/database/data-source';
import { setup } from '../src/setup';

const createTaskBuilder = build({
  fields: {
    text: perBuild(() => faker.lorem.sentence()),
  },
});
const client = new IntegreSQLClient({
  url: process.env['INTEGRESQL_URL'] ?? 'http://localhost:5000',
});

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let hash: string;

  beforeAll(async () => {
    hash = await client.hashFiles([
      './src/migrations/**/*',
      './src/**/*.factory.ts',
      './src/**/*.seeder.ts',
    ]);

    await client.initializeTemplate(hash, async dbConfig => {
      dataSource.setOptions({
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        port: dbConfig.port,
      });

      await dataSource.initialize();
      await dataSource.runMigrations();
      await runSeeders(dataSource);
      await dataSource.destroy();
    });
  });

  beforeEach(async () => {
    const dbConfig = await client.getTestDatabase(hash);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TypeOrmModule)
      .useModule(
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          port: dbConfig.port,
          synchronize: false,
          autoLoadEntities: true,
        }),
      )
      .compile();

    app = setup(moduleFixture.createNestApplication());

    await app.init();

    request = supertest(app.getHttpServer());

    const {
      header: { authorization },
    } = await supertest(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'john@doe.me', password: 'Pa$$w0rd' });
    [, token] = authorization.split(/\s+/);
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    ['post', '/task'],
    ['get', '/task'],
    ['get', '/task/1'],
    ['put', '/task/1'],
    ['delete', '/task/1'],
    ['patch', '/task/1/done'],
    ['patch', '/task/1/pending'],
  ])('should require authentication', async (method, url) => {
    switch (method) {
      case 'post':
        await request
          .post(url)
          .send(createTaskBuilder())
          .expect(HttpStatus.UNAUTHORIZED);
        break;
      case 'get':
        await request.get(url).expect(HttpStatus.UNAUTHORIZED);
        break;
      case 'put':
        await request
          .put(url)
          .send(createTaskBuilder())
          .expect(HttpStatus.UNAUTHORIZED);
        break;
      case 'delete':
        await request.delete(url).expect(HttpStatus.UNAUTHORIZED);
        break;
      case 'patch':
        await request.patch(url).expect(HttpStatus.UNAUTHORIZED);
        break;
    }
  });

  it('should create a new task', async () => {
    const payload = createTaskBuilder();
    const resp = await request
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(HttpStatus.CREATED);

    expect(resp.body).toHaveProperty('text', payload.text);
    expect(resp.body).toHaveProperty('done', false);
  });

  it('should fail to create with invalid body', async () => {
    const resp = await request
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect('Content-Type', /json/);

    expect(resp.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should list all tasks that belong to user', async () => {
    const resp = await request
      .get('/task')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(resp.body).toMatchObject({
      items: expect.any(Array),
      meta: {
        itemCount: expect.any(Number),
        totalItems: expect.any(Number),
        itemsPerPage: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
      },
      links: {
        first: expect.stringContaining('http://127.0.0.1'),
        next: expect.stringContaining('http://127.0.0.1'),
        last: expect.stringContaining('http://127.0.0.1'),
      },
    });
  });

  it('should get one task that belong to user', async () => {
    const resp = await request
      .get('/task/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(resp.body).toBeDefined();
    expect(resp.body).not.toHaveProperty('owner');
  });

  it('should update one task that belong to user', async () => {
    const resp = await request
      .put('/task/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ done: true })
      .expect(HttpStatus.OK);

    expect(resp.body).not.toHaveProperty('owner');
    expect(resp.body).toHaveProperty('done', true);
  });

  it('should remove one task that belong to user', async () => {
    const { body: task } = await request
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send(createTaskBuilder())
      .expect(HttpStatus.CREATED);
    await request
      .delete(`/task/${task.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should mark one task as done', async () => {
    const resp = await request
      .patch('/task/1/done')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(resp.body).toHaveProperty('done', true);
  });

  it('should mark one task as pending', async () => {
    const resp = await request
      .patch('/task/1/pending')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(resp.body).toHaveProperty('done', false);
  });
});
