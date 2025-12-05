import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module';
import { cleanDatabase } from './setup';

interface LoginResponse {
  access_token: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    httpServer = app.getHttpServer() as Server;

    await cleanDatabase();

    await request(httpServer).post('/auth/register').send({
      name: 'App Tester',
      email: 'app@test.com',
      password: 'password123',
      workshopName: 'Test Workshop',
    });

    const loginRes = await request(httpServer).post('/auth/login').send({
      email: 'app@test.com',
      password: 'password123',
    });

    const body = loginRes.body as LoginResponse;
    token = body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(httpServer)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Hello World!');
  });
});
