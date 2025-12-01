import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module';
import { cleanDatabase } from './setup';

interface LoginResponse {
  access_token: string;
}
interface UserProfile {
  avatarUrl: string;
}
interface IdResponse {
  id: string;
  publicToken: string;
  status: string;
}

interface UploadResponse {
  message: string;
  avatarUrl: string;
}

describe('Advanced Features & Innovation (E2E)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let token: string;

  let orderPublicToken: string;

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
      name: 'Feature User',
      email: 'feat@test.com',
      password: 'password123',
    });
    const loginRes = await request(httpServer).post('/auth/login').send({
      email: 'feat@test.com',
      password: 'password123',
    });
    const loginBody = loginRes.body as LoginResponse;
    token = loginBody.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Avatar Upload', () => {
    it('Should fail if file type is not image', async () => {
      await request(httpServer)
        .patch('/auth/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('texto qualquer'), 'fake.txt')
        .expect(400);
    });

    it('Should upload a valid image successfully', async () => {
      const fakeImageBuffer = Buffer.from('fake-image-content');

      const res = await request(httpServer)
        .patch('/auth/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', fakeImageBuffer, 'test-avatar.png')
        .expect(200);

      const body = res.body as UploadResponse;

      expect(body.message).toBe('Avatar atualizado!');
      expect(body.avatarUrl).toContain('/uploads/avatar-');
    });

    it('Should have updated the user profile with the new avatar URL', async () => {
      const res = await request(httpServer)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = res.body as UserProfile;
      expect(body.avatarUrl).toContain('/uploads/avatar-');
      expect(body.avatarUrl).toMatch(/\.png$/);
    });
  });

  describe('Public Order Portal', () => {
    let vehicleId: string;
    let serviceId: string;

    beforeAll(async () => {
      const cRes = await request(httpServer)
        .post('/client')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Public Client', email: 'pub@test.com' });

      const vRes = await request(httpServer)
        .post('/vehicle')
        .set('Authorization', `Bearer ${token}`)
        .send({
          plate: 'PUB-1234',
          model: 'X',
          brand: 'Y',
          year: 2022,
          clientId: (cRes.body as IdResponse).id,
        });
      vehicleId = (vRes.body as IdResponse).id;

      const sRes = await request(httpServer)
        .post('/service')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Public Service', price: 100 });
      serviceId = (sRes.body as IdResponse).id;

      const orderRes = await request(httpServer)
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send({ vehicleId, serviceIds: [serviceId], parts: [] });

      const orderBody = orderRes.body as IdResponse;
      orderPublicToken = orderBody.publicToken;
    });

    it('Should fetch order publicly via Token (No Auth)', async () => {
      const res = await request(httpServer)
        .get(`/order/public/${orderPublicToken}`)
        .expect(200);

      expect((res.body as IdResponse).id).toBeDefined();
      expect((res.body as IdResponse).status).toBe('PENDING');
    });

    it('Should Approve order via public link', async () => {
      const res = await request(httpServer)
        .patch(`/order/public/${orderPublicToken}/approve`)
        .expect(200);

      expect((res.body as IdResponse).status).toBe('APPROVED');
    });

    it('Should verify status change in internal API (Authenticated)', async () => {
      const res = await request(httpServer)
        .get('/order')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const orders = res.body as IdResponse[];
      const myOrder = orders.find((o) => o.publicToken === orderPublicToken);
      expect(myOrder?.status).toBe('APPROVED');
    });
  });
});
