import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module';
import { cleanDatabase } from './setup';

interface LoginResponse {
  access_token: string;
}

interface IdResponse {
  id: string;
}

interface NestErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

describe('Business Rules and Constraints (E2E)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let token: string;

  let clientId: string;
  let vehicleId: string;
  let orderId: string;
  let serviceId: string;

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
      name: 'Manager',
      email: 'manager@rules.com',
      password: 'password123',
    });
    const loginRes = await request(httpServer).post('/auth/login').send({
      email: 'manager@rules.com',
      password: 'password123',
    });

    const loginBody = loginRes.body as LoginResponse;
    token = loginBody.access_token;

    const clientRes = await request(httpServer)
      .post('/client')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Blocked Client', email: 'block@test.com' });
    const clientBody = clientRes.body as IdResponse;
    clientId = clientBody.id;

    const vehicleRes = await request(httpServer)
      .post('/vehicle')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plate: 'BLK-9999',
        model: 'Tank',
        brand: 'Army',
        year: 2024,
        clientId,
      });
    const vehicleBody = vehicleRes.body as IdResponse;
    vehicleId = vehicleBody.id;

    const serviceRes = await request(httpServer)
      .post('/service')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'General Repair', price: 500.0 });
    const serviceBody = serviceRes.body as IdResponse;
    serviceId = serviceBody.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Step 1: Should create an Active Order (PENDING)', async () => {
    const res = await request(httpServer)
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId,
        serviceIds: [serviceId],
        parts: [],
      })
      .expect(201);

    const body = res.body as IdResponse;
    orderId = body.id;
  });

  it('Step 2: Should BLOCK deleting the Client (Conflict)', async () => {
    const res = await request(httpServer)
      .delete(`/client/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    const errorBody = res.body as NestErrorResponse;

    expect(errorBody.message).toMatch(/cannot delete|não é possível/i);
  });

  it('Step 3: Should Cancel the Order (Change status to REJECTED)', async () => {
    await request(httpServer)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'REJECTED' })
      .expect(200);
  });

  it('Step 4: Should ALLOW deleting the Client now (Soft Delete)', async () => {
    await request(httpServer)
      .delete(`/client/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('Step 5: Should verify Client is gone (404)', async () => {
    await request(httpServer)
      .get(`/client/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
