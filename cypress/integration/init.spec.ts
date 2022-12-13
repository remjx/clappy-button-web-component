/// <reference types="../support" />

context('Interaction tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5000');
	});

	it('Defaults to 0.01 USD per clap', () => {
		cy.getClient()
			.find('#tipSection')
			.then(($tipSection) => {
				cy.wrap($tipSection).find('button#tipBtn').click();
				cy.wrap($tipSection).find('span#tipCount').contains('+$0.01');
				cy.wrap($tipSection).find('button#tipBtn').click();
				cy.wrap($tipSection).find('span#tipCount').contains('+$0.02');
			});
	});
});
