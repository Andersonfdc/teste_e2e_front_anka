declare namespace Cypress {
  interface Chainable {
    loginWithRealOtp(input: { email: string; password: string }): Chainable<void>;
    fillLoginForm(input: { email: string; password: string }): Chainable<void>;
    fillOtpCode(code: string): Chainable<void>;
    submitCurrentForm(): Chainable<void>;
  }
}

export {};
