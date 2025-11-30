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
interface PartResponse {
  id: string;
  stock: number;
}
interface OrderResponse {
  id: string;
  status: string;
  totalPartsPrice: number;
  totalServicesPrice: number;
  totalPrice: number;
}

describe('Service Order Workflow (E2E)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let token: string;

  let vehicleId: string;
  let partId: string;
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

    const uniqueEmail = `admin_orders_${Date.now()}@test.com`;
    const password = 'password123';

    await request(httpServer).post('/auth/register').send({
      name: 'Admin',
      email: uniqueEmail,
      password: password,
    });

    const loginRes = await request(httpServer).post('/auth/login').send({
      email: uniqueEmail,
      password: password,
    });

    const loginBody = loginRes.body as LoginResponse;
    token = loginBody.access_token;

    const clientRes = await request(httpServer)
      .post('/client')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Order Client', email: 'order@test.com' });
    const clientBody = clientRes.body as IdResponse;
    const clientId = clientBody.id;

    const vehicleRes = await request(httpServer)
      .post('/vehicle')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plate: 'ORD-1234',
        model: 'Golf',
        brand: 'VW',
        year: 2020,
        clientId,
      });
    const vehicleBody = vehicleRes.body as IdResponse;
    vehicleId = vehicleBody.id;

    const partRes = await request(httpServer)
      .post('/part')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Part', sku: 'SKU-ORD', stock: 10, price: 50.0 });
    const partBody = partRes.body as IdResponse;
    partId = partBody.id;

    const serviceRes = await request(httpServer)
      .post('/service')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Labor Service', price: 100.0 });
    const serviceBody = serviceRes.body as IdResponse;
    serviceId = serviceBody.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create an Order and calculate total price correctly', async () => {
    const res = await request(httpServer)
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId,
        serviceIds: [serviceId],
        parts: [{ partId, quantity: 2 }],
      })
      .expect(201);

    const body = res.body as OrderResponse;

    expect(body.totalPartsPrice).toBe(100);
    expect(body.totalServicesPrice).toBe(100);
    expect(body.totalPrice).toBe(200);
    expect(body.status).toBe('PENDING');
  });

  it('Should have decreased part stock', async () => {
    const res = await request(httpServer)
      .get(`/part/${partId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body = res.body as PartResponse;
    expect(body.stock).toBe(8);
  });

  it('Should block Order creation if insufficient stock', async () => {
    await request(httpServer)
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId,
        serviceIds: [],
        parts: [{ partId, quantity: 20 }],
      })
      .expect(404);
  });
});
