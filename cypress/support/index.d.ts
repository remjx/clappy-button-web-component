/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject> {
		getClient(): Chainable<JQuery<HTMLElement>>;
		withinClient(cb: () => void): Chainable<JQuery<HTMLElement>>;
		withinServerWC(cb: () => void): Chainable<JQuery<HTMLElement>>;
		iframe(cb: () => void): Chainable<JQuery<HTMLElement>>;
		simulateIframeAuthNotifierSuccess(): Chainable<null>;
		simulateServerWCLoaded(): Chainable<null>;
	}
}
