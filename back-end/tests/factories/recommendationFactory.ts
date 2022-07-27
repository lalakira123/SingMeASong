import { faker } from '@faker-js/faker';
import { prisma } from './../../src/database.js';

function validRecommendation(){
  return {
    name: faker.internet.userName(),
    youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1'
  }
}

function invalidRecommendation(){
  return {
    name: faker.internet.userName(),
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

async function createElevenRecommendations(){
  await prisma.recommendation.createMany({
    data: [
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:1},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:2},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:10},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:3},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:22},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:11},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:3},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:4},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:5},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:2},
      {name: faker.internet.userName(), youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc&list=RDqpUSqqusmYc&start_radio=1', score:13}
    ]
  });
}

async function findRecommendationByName(name: string){
  const recommendation = await prisma.recommendation.findFirst({
    where: {
      name
    }
  });
  return recommendation;
}

async function findRecommendations(){
  const recommendations = await prisma.recommendation.findMany();
  return recommendations;
}

export {
  validRecommendation,
  invalidRecommendation,
  createRecommendation,
  createElevenRecommendations,
  findRecommendationByName,
  findRecommendations
}