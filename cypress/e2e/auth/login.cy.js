import { loginPage } from "../../support/pages/login.page";
import { otpPage } from "../../support/pages/otp.page";
import { homePage } from "../../support/pages/home.page";
import { sidebarPage } from "../../support/pages/sidebar.page";

const apiBase = "http://localhost:3333/api/v1";
const testUser = {
  email: "murilo@ankatech.com.br",
  password: "password",
};

describe("Autenticação - Login", () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it("Dado a tela de login, Quando submeter sem preencher, Então deve exibir erros obrigatórios", () => {
    loginPage.ensureHydrated();
    loginPage.submit();
    loginPage.resubmitIfNativeSubmitHappened();
    loginPage.assertRequiredFieldErrors();
  });

  it("Dado credenciais válidas, Quando enviar o login, Então deve redirecionar para OTP", () => {
    cy.intercept("POST", "**/auth/login", (req) => {
      expect(req.headers).to.have.property("x-api-key");
      expect(req.body).to.deep.equal({
        email: "murilo@ankatech.com.br",
        password: "password",
      });

      req.reply({
        statusCode: 200,
        body: {
          status: true,
          message: "Código enviado. Verifique seu e-mail.",
          challengeId: 123,
        },
      });
    }).as("loginRequest");

    loginPage.fillCredentials(testUser);
    loginPage.submit();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/auth/login/otp/123");
  });

  it("Dado credenciais inválidas, Quando enviar o login, Então deve exibir erro de autenticação", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: {
        message: "Credenciais inválidas",
        code: "INVALID_CREDENTIALS",
      },
    }).as("loginUnauthorized");

    loginPage.fillCredentials({
      email: "murilo@ankatech.com.br",
      password: "wrong-password",
    });

    loginPage.submit();

    cy.wait("@loginUnauthorized").its("response.statusCode").should("eq", 401);
    loginPage.assertUnauthorizedMessage();
  });

  it("Dado challengeId ativo, Quando capturar OTP no banco e confirmar, Então deve autenticar e ir para Home", () => {
    cy.request({
      method: "POST",
      url: `${apiBase}/auth/login`,
      headers: {
        "x-api-key": "dev-api-key",
      },
      body: testUser,
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.challengeId).to.be.a("number");

      const challengeId = body.challengeId;

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        cy.intercept("GET", "**/auth/me", {
          statusCode: 200,
          body: {
            status: true,
            message: "Usuário autenticado",
            user: {
              id: "11111111-1111-1111-1111-111111111111",
              name: "Murilo Viana",
              email: testUser.email,
              role: "ADMIN",
              isActive: true,
              exp: 9999999999,
              iat: 1111111111,
            },
          },
        }).as("getMe");

        cy.intercept("POST", "**/auth/otp/verify").as("verifyOtpReal");

        otpPage.visit(challengeId);
        otpPage.fillCode(otpCode);
        otpPage.submit();

        cy.wait("@verifyOtpReal").its("response.statusCode").should("eq", 200);
        homePage.assertLoaded();
      });
    });
  });

  it("Dado usuário autenticado, Quando clicar em Sair, Então deve limpar sessão e voltar para login", () => {
    cy.request({
      method: "POST",
      url: `${apiBase}/auth/login`,
      headers: {
        "x-api-key": "dev-api-key",
      },
      body: testUser,
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.challengeId).to.be.a("number");

      const challengeId = body.challengeId;

      cy.intercept("POST", "**/auth/otp/verify").as("verifyOtpForLogout");
      cy.intercept("GET", "**/auth/me").as("getMeForLogout");

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        otpPage.visit(challengeId);
        otpPage.fillCode(otpCode);
        otpPage.submit();

        cy.wait("@verifyOtpForLogout").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeForLogout").its("response.statusCode").should("eq", 200);
        homePage.assertLoaded();

        sidebarPage.clickLogout();
        cy.url().should("include", "/auth/login");

        cy.getCookie("token").should("not.exist");
        cy.getCookie("refreshToken").should("not.exist");
        cy.getCookie("userId").should("not.exist");
      });
    });
  });
});

describe("Autenticação - Login Responsivo", () => {
  it("Dado viewport mobile, Quando abrir login, Então deve renderizar elementos essenciais", () => {
    cy.viewport(390, 844);
    loginPage.visit();

    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.get("img[alt='Vertical Anka Logo']").should("not.be.visible");
  });

  it("Dado viewport mobile, Quando efetuar login com sucesso, Então deve ir para OTP", () => {
    cy.viewport(375, 667);
    loginPage.visit();

    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        status: true,
        message: "Código enviado. Verifique seu e-mail.",
        challengeId: 456,
      },
    }).as("loginRequestMobile");

    loginPage.fillCredentials(testUser);
    loginPage.submit();

    cy.wait("@loginRequestMobile").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/auth/login/otp/456");
  });

  it("Dado viewport mobile e challenge válido, Quando capturar e informar OTP real, Então deve autenticar", () => {
    cy.viewport(390, 844);
    loginPage.visit();

    cy.intercept("POST", "**/auth/login").as("loginMobileReal");
    cy.intercept("POST", "**/auth/otp/verify").as("verifyOtpMobileReal");
    cy.intercept("GET", "**/auth/me", {
      statusCode: 200,
      body: {
        status: true,
        message: "Usuário autenticado",
        user: {
          id: "11111111-1111-1111-1111-111111111111",
          name: "Murilo Viana",
          email: testUser.email,
          role: "ADMIN",
          isActive: true,
          exp: 9999999999,
          iat: 1111111111,
        },
      },
    }).as("getMeMobileReal");

    loginPage.fillCredentials(testUser);
    loginPage.submit();

    cy.wait("@loginMobileReal").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      const challengeId = response?.body?.challengeId;
      expect(challengeId).to.be.a("number");

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        cy.url().should("include", `/auth/login/otp/${challengeId}`);
        otpPage.fillCode(otpCode);
        otpPage.submit();

        cy.wait("@verifyOtpMobileReal").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeMobileReal").its("response.statusCode").should("eq", 200);
        homePage.assertLoaded();
      });
    });
  });

  it("Dado usuário autenticado no mobile, Quando realizar logout, Então deve retornar ao login sem cookies", () => {
    cy.viewport(390, 844);
    loginPage.visit();

    cy.intercept("POST", "**/auth/login").as("loginMobileLogout");
    cy.intercept("POST", "**/auth/otp/verify").as("verifyOtpMobileLogout");
    cy.intercept("GET", "**/auth/me").as("getMeMobileLogout");

    loginPage.fillCredentials(testUser);
    loginPage.submit();

    cy.wait("@loginMobileLogout").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      const challengeId = response?.body?.challengeId;
      expect(challengeId).to.be.a("number");

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        cy.url().should("include", `/auth/login/otp/${challengeId}`);
        otpPage.fillCode(otpCode);
        otpPage.submit();

        cy.wait("@verifyOtpMobileLogout").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeMobileLogout").its("response.statusCode").should("eq", 200);
        homePage.assertLoaded();

        sidebarPage.clickLogoutMobile();

        cy.url().should("include", "/auth/login");
        cy.getCookie("token").should("not.exist");
        cy.getCookie("refreshToken").should("not.exist");
        cy.getCookie("userId").should("not.exist");
      });
    });
  });
});
