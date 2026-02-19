import { defineConfig } from "cypress";
import pg from "pg";

const { Client } = pg;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1366,
    viewportHeight: 768,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on("task", {
        async getOtpCode({ challengeId }) {
          const databaseUrl =
            process.env.CYPRESS_DB_URL ??
            process.env.DATABASE_URL ??
            "postgresql://postgres:postgres@localhost:5434/postgres";

          const client = new Client({
            connectionString: databaseUrl,
          });

          try {
            await client.connect();

            for (let attempt = 0; attempt < 10; attempt += 1) {
              const result = await client.query(
                `SELECT code
                 FROM verification_codes
                 WHERE id = $1 AND consumed = false
                 LIMIT 1`,
                [challengeId],
              );

              const row = result.rows[0];
              if (row?.code) {
                return row.code;
              }

              await delay(500);
            }

            throw new Error(`OTP não encontrado para challengeId ${challengeId}`);
          } finally {
            await client.end();
          }
        },
      });
    },
  },
});
