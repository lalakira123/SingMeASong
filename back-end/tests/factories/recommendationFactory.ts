import { faker } from '@faker-js/faker';
import { prisma } from './../../src/database.js';

function validRecommendation(){
  return {
    name: faker.internet.domainName(),
    youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1'
  }
}

function invalidRecommendation(){
  return {
    name: faker.internet.domainName(),
    youtubeLink: faker.internet.url()
  }
}

interface CreateRecommendationData {
  name: string,
  youtubeLink: string
}

async function createRecommendation(recommendation: CreateRecommendationData){
  const { name, youtubeLink } = recommendation;
  await prisma.recommendation.create({
    data: {
      name,
      youtubeLink
    }
  })
}

async function findRecommendationByName(name: string){
  const recommendation = await prisma.recommendation.findUnique({
    where: {
      name
    }
  });
  return recommendation;
}

export {
  validRecommendation,
  invalidRecommendation,
  createRecommendation,
  findRecommendationByName
}