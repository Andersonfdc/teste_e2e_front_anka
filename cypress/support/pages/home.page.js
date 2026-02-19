export const homePage = {
  assertLoaded() {
    cy.url().should("include", "/home");
    cy.contains("Home").should("be.visible");
    cy.contains(/Bem-vindo ao painel\.?/).should("be.visible");
  },
};
