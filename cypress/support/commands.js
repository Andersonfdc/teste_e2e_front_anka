Cypress.Commands.add("fillLoginForm", ({ email, password }) => {
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password, { log: false });
});

Cypress.Commands.add("loginWithRealOtp", ({ email, password }) => {
  const apiBaseUrl = Cypress.env("apiBaseUrl") || "http://localhost:3333/api/v1";
  const apiKey = Cypress.env("apiKey") || "dev-api-key";

  cy.visit("/auth/login");

  cy.request({
    method: "POST",
    url: `${apiBaseUrl}/auth/login`,
    headers: {
      "x-api-key": apiKey,
    },
    body: { email, password },
  }).then(({ status, body }) => {
    expect(status).to.eq(200);
    expect(body.challengeId).to.be.a("number");

    const challengeId = body.challengeId;

    cy.task("getOtpCode", { challengeId }).then((otpCode) => {
      cy.request({
        method: "POST",
        url: `${apiBaseUrl}/auth/otp/verify`,
        headers: {
          "x-api-key": apiKey,
        },
        body: {
          challengeId,
          code: String(otpCode),
          rememberMe: false,
        },
      }).then(({ status: verifyStatus, body: verifyBody }) => {
        expect(verifyStatus).to.eq(200);

        cy.setCookie("token", verifyBody.accessToken);
        cy.setCookie("refreshToken", verifyBody.refreshToken);
        cy.setCookie("userId", verifyBody.user.id);
      });
    });
  });

  cy.visit("/home");
});

Cypress.Commands.add("fillOtpCode", (code) => {
  cy.get('input[data-input-otp="true"]').should("be.visible").clear().type(code);
});

Cypress.Commands.add("submitCurrentForm", () => {
  cy.contains('button[type="submit"]:visible', /Enviar código|Confirmar/i)
    .first()
    .scrollIntoView()
    .should("be.visible")
    .and("not.be.disabled")
    .click({ force: true });
});
