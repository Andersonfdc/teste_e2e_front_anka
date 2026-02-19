import { homePage } from "../../support/pages/home.page";
import { sidebarPage } from "../../support/pages/sidebar.page";
import { usersPage } from "../../support/pages/users.page";

const testUser = {
  email: "murilo@ankatech.com.br",
  password: "password",
};

const onlyUser = {
  name: "Murilo Viana",
  email: "murilo@ankatech.com.br",
  role: "Administrador",
  status: "Ativo",
};

describe("Usuários - Filtros e Busca", () => {
  beforeEach(() => {
    cy.loginWithRealOtp(testUser);
    homePage.assertLoaded();
    sidebarPage.clickUsers();
    usersPage.assertActivePage();
    usersPage.waitTableLoaded();
  });

  it("Dado a listagem de usuários, Quando filtrar por função, Então deve refletir o resultado esperado", () => {
    usersPage.selectRole("Administrador");
    usersPage.assertUserVisible(onlyUser);

    usersPage.selectRole("Membro");
    usersPage.assertNoResults();

    usersPage.selectRole("Todas as funções");
    usersPage.assertUserVisible(onlyUser);
  });

  it("Dado a listagem de usuários, Quando filtrar por status, Então deve refletir o resultado esperado", () => {
    usersPage.selectStatus("Ativos");
    usersPage.assertUserVisible(onlyUser);

    usersPage.selectStatus("Inativos");
    usersPage.assertNoResults();

    usersPage.selectStatus("Todos os status");
    usersPage.assertUserVisible(onlyUser);
  });

  it("Dado a listagem de usuários, Quando buscar por nome ou email, Então deve aplicar o filtro corretamente", () => {
    usersPage.searchBy("Murilo");
    usersPage.assertUserVisible(onlyUser);

    usersPage.searchBy("murilo@ankatech.com.br");
    usersPage.assertUserVisible(onlyUser);

    usersPage.searchBy("usuario-inexistente");
    usersPage.assertNoResults();

    usersPage.searchBy("");
    usersPage.assertUserVisible(onlyUser);
  });
});
