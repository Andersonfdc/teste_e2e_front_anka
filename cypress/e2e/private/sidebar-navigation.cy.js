import { homePage } from "../../support/pages/home.page";
import { sidebarPage } from "../../support/pages/sidebar.page";
import { usersPage } from "../../support/pages/users.page";

const testUser = {
  email: "murilo@ankatech.com.br",
  password: "password",
};

describe("Área Privada - Navegação Sidebar", () => {
  beforeEach(() => {
    cy.loginWithRealOtp(testUser);
    homePage.assertLoaded();
  });

  it("Dado usuário autenticado, Quando navegar no sidebar, Então deve alternar entre Home e Usuários", () => {
    sidebarPage.clickUsers();
    usersPage.assertActivePage();

    usersPage.goToInactiveTab();
    usersPage.goToActiveTab();

    sidebarPage.clickHome();
    homePage.assertLoaded();
  });

  it("Dado sidebar expandido, Quando colapsar e expandir novamente, Então a navegação deve continuar funcional", () => {
    cy.get("aside").within(() => {
      cy.contains("Usuários").should("be.visible");
    });

    sidebarPage.assertExpanded();
    sidebarPage.collapse();
    sidebarPage.assertCollapsed();

    sidebarPage.expand();
    sidebarPage.assertExpanded();
    cy.get("aside").contains("Usuários").should("be.visible");

    sidebarPage.clickUsers();
    usersPage.assertActivePage();
  });

  it("Dado ambiente estável, Quando navegar para Usuários, Então deve atender critérios de latência e estabilidade", () => {
    const navigationStart = Date.now();

    sidebarPage.clickUsers();
    usersPage.assertActivePage();

    const navigationElapsed = Date.now() - navigationStart;
    expect(navigationElapsed).to.be.lessThan(4000);

    cy.getCookie("token").then((tokenCookie) => {
      expect(tokenCookie?.value).to.be.a("string");

      cy.request({
        method: "GET",
        url: "http://localhost:3333/api/v1/users/?page=1&limit=10",
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.duration).to.be.lessThan(4000);
      });
    });

    cy.window().then((win) => {
      const entries = win.performance.getEntriesByType("navigation");
      if (entries.length > 0) {
        expect(entries[0].duration).to.be.lessThan(10000);
      }
    });

    cy.get("aside").should("be.visible");
    cy.get("main").should("be.visible");
    cy.contains("h1", "Usuários").should("be.visible");
  });
});
