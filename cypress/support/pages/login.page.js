export const loginPage = {
  visit() {
    cy.visit("/auth/login");
  },

  ensureHydrated() {
    cy.get('input[name="email"]').type("a").clear();
    cy.get('input[name="password"]').type("a").clear();
  },

  fillCredentials({ email, password }) {
    cy.fillLoginForm({ email, password });
  },

  submit() {
    cy.submitCurrentForm();
  },

  resubmitIfNativeSubmitHappened() {
    cy.location("search").then((search) => {
      if (search.includes("email=&password=")) {
        this.visit();
        this.ensureHydrated();
        this.submit();
      }
    });
  },

  assertRequiredFieldErrors() {
    cy.get('input[name="email"]').should("have.attr", "aria-invalid", "true");
    cy.get('input[name="password"]').should("have.attr", "aria-invalid", "true");
    cy.contains('[data-slot="form-message"]', "Email inválido").should("be.visible");
    cy.contains(
      '[data-slot="form-message"]',
      "Senha deve ter pelo menos 6 caracteres",
    ).should("be.visible");
  },

  assertUnauthorizedMessage() {
    cy.contains("Credenciais inválidas").should("be.visible");
  },
};
