/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

const URL = 'http://localhost:3000';

beforeEach(() => {
  cy.resetDatabase();
});

describe('Navigation Page', () => {
  const recommendation = {
    name: faker.internet.userName(),
    youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc'
  };
  
  beforeEach(() => {
    cy.createRecommendation(recommendation);
  });
  
  it('on click top should redirect to all pages', async () => {
    cy.visit(URL);
  
    cy.contains('Top').click();
    cy.url().should('equal', `${URL}/top`);

    cy.contains('Random').click();
    cy.url().should('equal', `${URL}/random`);

    cy.contains('Home').click();
    cy.url().should('equal', `${URL}/`);
  });
});