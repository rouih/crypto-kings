import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BalancesModule } from '../src/balances/balances.module';
import { CacheService } from '../../../libs/shared/src/cache/cache.service';

describe('BalancesController (e2e)', () => {
  let app: INestApplication;
  let cacheService: CacheService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BalancesModule],
    })
      .overrideProvider(CacheService)
      .useValue({
        get: jest.fn(),
        set: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cacheService = moduleFixture.get<CacheService>(CacheService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add a balance successfully', async () => {
    jest.spyOn(cacheService, 'set').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post('/balances/')
      .set('x-user-id', '1')
      .send({ asset: 'BTC', amount: 0.5 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Balance BTC added successfully');
  });

  it('should return error if deducting more than available balance', async () => {
    jest.spyOn(cacheService, 'get').mockResolvedValue(0.1);

    const response = await request(app.getHttpServer())
      .put('/balances/')
      .set('x-user-id', '1')
      .send({ asset: 'BTC', amount: 1 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      'User not found or no balances available',
    );
  });
});
