Cypress.Commands.add('getClient', () => {
	return cy.get('clappy-button').shadow();
});

Cypress.Commands.add('withinClient', (callback) => {
	return cy.get('clappy-button').shadow().within(callback);
});

// TODO: add command to clear attributes on <clappy-button> between tests.

import '@testing-library/cypress/add-commands';
