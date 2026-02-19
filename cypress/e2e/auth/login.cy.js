const apiBase = "http://localhost:3333/api/v1";
const testUser = {
  email: "murilo@ankatech.com.br",
  password: "password",
};

describe("Auth - Login", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("deve validar campos obrigatórios", () => {
    cy.get('input[name="email"]').type("a").clear();
    cy.get('input[name="password"]').type("a").clear();

    cy.submitCurrentForm();

    cy.location("search").then((search) => {
      if (search.includes("email=&password=")) {
        cy.visit("/auth/login");
        cy.get('input[name="email"]').type("a").clear();
        cy.get('input[name="password"]').type("a").clear();
        cy.submitCurrentForm();
      }
    });

    cy.get('input[name="email"]').should("have.attr", "aria-invalid", "true");
    cy.get('input[name="password"]').should("have.attr", "aria-invalid", "true");
    cy.contains('[data-slot="form-message"]', "Email inválido").should("be.visible");
    cy.contains(
      '[data-slot="form-message"]',
      "Senha deve ter pelo menos 6 caracteres",
    ).should("be.visible");
  });

  it("deve enviar login e redirecionar para OTP quando API retorna sucesso", () => {
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

    cy.fillLoginForm({
      email: "murilo@ankatech.com.br",
      password: "password",
    });

    cy.submitCurrentForm();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/auth/login/otp/123");
  });

  it("deve exibir mensagem de erro quando credenciais forem inválidas", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: {
        message: "Credenciais inválidas",
        code: "INVALID_CREDENTIALS",
      },
    }).as("loginUnauthorized");

    cy.fillLoginForm({
      email: "murilo@ankatech.com.br",
      password: "wrong-password",
    });

    cy.submitCurrentForm();

    cy.wait("@loginUnauthorized").its("response.statusCode").should("eq", 401);
    cy.contains("Credenciais inválidas").should("be.visible");
  });

  it("deve concluir autenticação sem depender do OTP dinâmico do backend", () => {
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

        cy.visit(`/auth/login/otp/${challengeId}`);
        cy.fillOtpCode(String(otpCode));
        cy.submitCurrentForm();

        cy.wait("@verifyOtpReal").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/home");
      });
    });
  });

  it("deve realizar logout após login com OTP real", () => {
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
        cy.visit(`/auth/login/otp/${challengeId}`);
        cy.fillOtpCode(String(otpCode));
        cy.submitCurrentForm();

        cy.wait("@verifyOtpForLogout").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeForLogout").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/home");

        cy.contains("button", "Sair").should("be.visible").click({ force: true });
        cy.url().should("include", "/auth/login");

        cy.getCookie("token").should("not.exist");
        cy.getCookie("refreshToken").should("not.exist");
        cy.getCookie("userId").should("not.exist");
      });
    });
  });
});

describe("Auth - Login (Responsividade)", () => {
  it("deve renderizar corretamente em viewport mobile", () => {
    cy.viewport(390, 844);
    cy.visit("/auth/login");

    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.get("img[alt='Vertical Anka Logo']").should("not.be.visible");
  });

  it("deve manter fluxo de login no mobile", () => {
    cy.viewport(375, 667);
    cy.visit("/auth/login");

    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        status: true,
        message: "Código enviado. Verifique seu e-mail.",
        challengeId: 456,
      },
    }).as("loginRequestMobile");

    cy.fillLoginForm({
      email: "murilo@ankatech.com.br",
      password: "password",
    });

    cy.submitCurrentForm();

    cy.wait("@loginRequestMobile").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/auth/login/otp/456");
  });

  it("deve concluir autenticação no mobile capturando OTP real do backend", () => {
    cy.viewport(390, 844);
    cy.visit("/auth/login");

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

    cy.fillLoginForm(testUser);
    cy.submitCurrentForm();

    cy.wait("@loginMobileReal").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      const challengeId = response?.body?.challengeId;
      expect(challengeId).to.be.a("number");

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        cy.url().should("include", `/auth/login/otp/${challengeId}`);
        cy.fillOtpCode(String(otpCode));
        cy.submitCurrentForm();

        cy.wait("@verifyOtpMobileReal").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeMobileReal").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/home");
      });
    });
  });

  it("deve realizar logout no mobile após login com OTP real", () => {
    cy.viewport(390, 844);
    cy.visit("/auth/login");

    cy.intercept("POST", "**/auth/login").as("loginMobileLogout");
    cy.intercept("POST", "**/auth/otp/verify").as("verifyOtpMobileLogout");
    cy.intercept("GET", "**/auth/me").as("getMeMobileLogout");

    cy.fillLoginForm(testUser);
    cy.submitCurrentForm();

    cy.wait("@loginMobileLogout").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      const challengeId = response?.body?.challengeId;
      expect(challengeId).to.be.a("number");

      cy.task("getOtpCode", { challengeId }).then((otpCode) => {
        cy.url().should("include", `/auth/login/otp/${challengeId}`);
        cy.fillOtpCode(String(otpCode));
        cy.submitCurrentForm();

        cy.wait("@verifyOtpMobileLogout").its("response.statusCode").should("eq", 200);
        cy.wait("@getMeMobileLogout").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/home");

        cy.contains("button", "Sair").should("be.visible").scrollIntoView().click({ force: true });

        cy.url().should("include", "/auth/login");
        cy.getCookie("token").should("not.exist");
        cy.getCookie("refreshToken").should("not.exist");
        cy.getCookie("userId").should("not.exist");
      });
    });
  });
});
