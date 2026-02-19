export const usersPage = {
  assertActivePage() {
    cy.url().should("include", "/users/active");
    cy.contains("h1", "Usuários").should("be.visible");
    cy.contains("Gestão de usuários").should("be.visible");
  },

  waitTableLoaded() {
    cy.contains("th", "Nome").should("be.visible");
    cy.contains("th", "Email").should("be.visible");
  },

  searchBy(term) {
    cy.get('input[placeholder="Buscar por nome ou email"]').clear();

    if (term) {
      cy.get('input[placeholder="Buscar por nome ou email"]').type(term);
    }
  },

  selectRole(label) {
    cy.contains("button", /Todas as funções|Administrador|Membro|Convidado/)
      .first()
      .click({ force: true });
    cy.contains('[role="option"]', label).click({ force: true });
  },

  selectStatus(label) {
    cy.contains("button", /Todos os status|Ativos|Inativos/)
      .first()
      .click({ force: true });
    cy.contains('[role="option"]', label).click({ force: true });
  },

  assertUserVisible(user) {
    cy.contains(user.name).should("be.visible");
    cy.contains(user.email).should("be.visible");
    cy.contains(user.role).should("be.visible");
    cy.contains(user.status).should("be.visible");
  },

  assertNoResults() {
    cy.contains("Nenhum resultado.").should("be.visible");
  },

  goToInactiveTab() {
    cy.get('a[href="/users/inactive"]').first().click({ force: true });
    cy.url().should("include", "/users/inactive");
  },

  goToActiveTab() {
    cy.get('a[href="/users/active"]').first().click({ force: true });
    cy.url().should("include", "/users/active");
  },
};
