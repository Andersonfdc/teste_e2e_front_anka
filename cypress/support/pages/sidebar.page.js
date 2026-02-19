export const sidebarPage = {
  clickUsers() {
    cy.get("aside").contains("Usuários").click({ force: true });
  },

  clickHome() {
    cy.get("aside").contains("Home").click({ force: true });
  },

  clickLogout() {
    cy.contains("button", "Sair").should("be.visible").click({ force: true });
  },

  clickLogoutMobile() {
    cy.contains("button", "Sair").should("be.visible").scrollIntoView().click({ force: true });
  },

  collapse() {
    cy.get('img[alt="Colapsar"]').click({ force: true });
  },

  expand() {
    cy.get('img[alt="Expandir"]').click({ force: true });
  },

  assertExpanded() {
    cy.get("aside").should("have.class", "w-[230px]");
  },

  assertCollapsed() {
    cy.get("aside").should("have.class", "w-[70px]");
    cy.get('img[alt="Expandir"]').should("be.visible");
  },
};
