import supertest from 'supertest';
import { faker } from '@faker-js/faker';

import app from './../src/app.js';
import { prisma } from './../src/database.js';

import * as recommendationFactory from './factories/recommendationFactory.js';

const agent = supertest(app);

describe('Test all Recomendation Route', () => {
  it('given a valid input should create recommendation', async () => {
    const recommendation = recommendationFactory.validRecommendation();

    await agent.post('/recommendation').send(recommendation);

    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);

    expect(recommendationCreated).not.toBeNull();
  });

  it('given an repeated name should return status code 409', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const response = await agent.post('/recommendation').send(recommendation);
    expect(response.statusCode).toEqual(409);
  });

  it('given an invalid input should return status code 422', async () => {
    const invalidRecommendation = recommendationFactory.invalidRecommendation();

    const response = await agent.post('/recommendation').send(invalidRecommendation);
    expect(response.statusCode).toEqual(422);
  });

  it('add one point on recommendations should return status code 200', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);

    const id = recommendationCreated.id;
    const response = await agent.post(`/recommendations/${id}/upvote`).send();
    expect(response.statusCode).toEqual(200);
  });

  it('given an inexistent id, should return status code 404', async () => {
    const id = faker.random.numeric(100)
    const response = await agent.post(`/recommendations/${id}/upvote`).send();
    expect(response.statusCode).toEqual(404);
  });
})
