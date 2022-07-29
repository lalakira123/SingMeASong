/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

const URL = 'http://localhost:3000';

beforeEach(() => {
  cy.resetDatabase();
});

describe('Create Recommendations', () => {
  it('should create a new recommendation and upvote/downvote the card', async () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: 'https://www.youtube.com/watch?v=qpUSqqusmYc'
    };

    cy.visit(URL);

    cy.get('[placeholder*="Name"]').type(recommendation.name);
    cy.get('[placeholder*="https://youtu.be/..."]').type(recommendation.youtubeLink);

    cy.intercept('POST', '/recommendations').as('postRecommendation');
    cy.get('button').click();
    cy.wait('@postRecommendation');

    cy.contains(`${recommendation.name}`).should('exist');

    cy.get('#up').click();
    cy.contains('1').should('exist');

    cy.get('#down').click();
    cy.contains('0').should('exist');
  });
});
