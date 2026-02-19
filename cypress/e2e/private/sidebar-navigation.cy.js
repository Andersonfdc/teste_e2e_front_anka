const testUser = {
  email: "murilo@ankatech.com.br",
  password: "password",
};

describe("Private - Sidebar Navigation", () => {
  beforeEach(() => {
    cy.loginWithRealOtp(testUser);
    cy.url().should("include", "/home");
    cy.contains("Home").should("be.visible");
    cy.contains(/Bem-vindo ao painel\.?/).should("be.visible");
  });

  it("deve navegar entre Home e Usuários pelo sidebar", () => {
    cy.get("aside").contains("Usuários").click({ force: true });
    cy.url().should("include", "/users/active");
    cy.contains("h1", "Usuários").should("be.visible");
    cy.contains("Gestão de usuários").should("be.visible");

    cy.get('a[href="/users/inactive"]').first().click({ force: true });
    cy.url().should("include", "/users/inactive");

    cy.get('a[href="/users/active"]').first().click({ force: true });
    cy.url().should("include", "/users/active");

    cy.get("aside").contains("Home").click({ force: true });
    cy.url().should("include", "/home");
    cy.contains(/Bem-vindo ao painel\.?/).should("be.visible");
  });

  it("deve alternar estado do sidebar e manter navegação funcional", () => {
    cy.get("aside").within(() => {
      cy.contains("Usuários").should("be.visible");
    });

    cy.get("aside").should("have.class", "w-[230px]");
    cy.get('img[alt="Colapsar"]').click({ force: true });
    cy.get("aside").should("have.class", "w-[70px]");
    cy.get('img[alt="Expandir"]').should("be.visible");

    cy.get('img[alt="Expandir"]').click({ force: true });
    cy.get("aside").should("have.class", "w-[230px]");
    cy.get("aside").contains("Usuários").should("be.visible");

    cy.get("aside").contains("Usuários").click({ force: true });
    cy.url().should("include", "/users/active");
  });

  it("deve atender validações não funcionais de navegação (latência e estabilidade)", () => {
    const navigationStart = Date.now();

    cy.get("aside").contains("Usuários").click({ force: true });
    cy.url().should("include", "/users/active");

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
