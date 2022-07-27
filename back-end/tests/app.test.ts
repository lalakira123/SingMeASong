import supertest from 'supertest';
import { faker } from '@faker-js/faker';

import app from './../src/app.js';
import { prisma } from './../src/database.js';

import * as recommendationFactory from './factories/recommendationFactory.js';

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`
    DELETE FROM recommendations;
  `
});

describe('Test all Recomendation Route', () => {
  it('given a valid input should create recommendation', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    
    await agent.post('/recommendations').send(recommendation);
    
    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);
    
    expect(recommendationCreated).not.toBeNull();
  });

  it('given an repeated name should return status code 409', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.statusCode).toEqual(409);
  });

  it('given an invalid input should return status code 422', async () => {
    const invalidRecommendation = recommendationFactory.invalidRecommendation();

    const response = await agent.post('/recommendations').send(invalidRecommendation);
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
    const id = faker.random.numeric(5)
    const response = await agent.post(`/recommendations/${id}/upvote`).send();
    expect(response.statusCode).toEqual(404);
  });
  
  it('minus one point on recommendations should return status code 200', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);

    const id = recommendationCreated.id;
    const response = await agent.post(`/recommendations/${id}/downvote`).send();
    expect(response.statusCode).toEqual(200); 
  });

  it('minus five points should delete the recommendation', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);

    const id = recommendationCreated.id;
    let cont = 0;
    while(cont != 6){
      await agent.post(`/recommendations/${id}/downvote`).send();
      cont++;
    }
    
    const recommendationUptaded = await recommendationFactory.findRecommendationByName(recommendation.name);
    expect(recommendationUptaded).toBeNull();
  });

  it('get the last ten recommendations', async () => {
    await recommendationFactory.createElevenRecommendations();
    
    const {body} = await agent.get('/recommendations');
    expect(body.length).toEqual(10);
  });

  it('get recommendations by id', async () => {
    const recommendation = recommendationFactory.validRecommendation();
    await recommendationFactory.createRecommendation(recommendation);

    const recommendationCreated = await recommendationFactory.findRecommendationByName(recommendation.name);
    
    const {body} = await agent.get(`/recommendations/${recommendationCreated.id}`);
    expect(body).not.toBeNull();
  });

  it('get recommendations by top scores', async () => {
    recommendationFactory.createElevenRecommendations();

    const amount = faker.random.numeric(1);

    const {body} = await agent.get(`/recommendations/top/${amount}`);
    
    let isRanked = false;
    for(let i = 0; i < body.length - 1; i++){
      if(body[i].score < body[i+1].score) {
        isRanked = false 
        break;
      }
      else isRanked = true;
    }

    expect(isRanked).toBe(true);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
