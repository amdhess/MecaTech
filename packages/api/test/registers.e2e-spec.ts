import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module';
import { cleanDatabase } from './setup';

interface LoginResponse {
  access_token: string;
}

interface ClientResponse {
  id: string;
  name: string;
}

interface VehicleResponse {
  id: string;
  client: { id: string };
}

interface PartResponse {
  id: string;
  sku: string;
  stock: number;
}

describe('Register Workflow (E2E)', () => {
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
      name: 'Tester',
      email: 'test@mecatech.com',
      password: 'password123',
    });

    const loginRes = await request(httpServer)
      .post('/auth/login')
      .send({ email: 'test@mecatech.com', password: 'password123' });

    const body = loginRes.body as LoginResponse;
    token = body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Clients', () => {
    it('/client (POST) - Should create a client', async () => {
      const res = await request(httpServer)
        .post('/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Client',
          email: 'client@test.com',
          phone: '123456789',
        })
        .expect(201);

      const body = res.body as ClientResponse;
      expect(body.name).toBe('Test Client');
    });

    it('/client (GET) - Should list clients', async () => {
      const res = await request(httpServer)
        .get('/client')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = res.body as ClientResponse[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });

  describe('Vehicles', () => {
    let localClientId: string;

    beforeAll(async () => {
      const res = await request(httpServer)
        .post('/client')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Car Owner', email: 'owner@car.com' });

      const body = res.body as ClientResponse;
      localClientId = body.id;
    });

    it('/vehicle (POST) - Should create a linked vehicle', async () => {
      const res = await request(httpServer)
        .post('/vehicle')
        .set('Authorization', `Bearer ${token}`)
        .send({
          plate: 'TST-9999',
          model: 'Beetle',
          brand: 'VW',
          year: 1980,
          clientId: localClientId,
        })
        .expect(201);

      const body = res.body as VehicleResponse;
      expect(body.client).toBeDefined();
      expect(body.client.id).toBe(localClientId);
    });
  });

  describe('Inventory (Parts)', () => {
    it('/part (POST) - Should create a part', async () => {
      const res = await request(httpServer)
        .post('/part')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Spark Plug',
          sku: 'SPK-001',
          stock: 10,
          price: 25.0,
        })
        .expect(201);

      const body = res.body as PartResponse;
      expect(body.sku).toBe('SPK-001');
    });
  });
});
