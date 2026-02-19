export const otpPage = {
  visit(challengeId) {
    cy.visit(`/auth/login/otp/${challengeId}`);
  },

  fillCode(code) {
    cy.fillOtpCode(String(code));
  },

  submit() {
    cy.submitCurrentForm();
  },
};
