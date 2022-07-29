Cypress.Commands.add('createRecommendation', (recommendation) => {
  cy.request('POST', 'http://localhost:5000/recommendations', recommendation)
  .then( res => {
     cy.log('Recommendation Criado', res);
  })
})

Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', 'http://localhost:5000/reset-database').as('resetDatabase')
  .then( res => {
    cy.log('Deletado todas Recomendações anteriores', res);
  });
})