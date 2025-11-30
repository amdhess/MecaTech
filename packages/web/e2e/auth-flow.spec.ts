import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("Should login successfully and redirect to dashboard", async ({
    page,
    request,
  }) => {
    await request.post("http://127.0.0.1:3000/auth/register", {
      data: {
        name: "Admin E2E",
        email: "admin_e2e@test.com",
        password: "password123",
      },
    });

    await page.goto("/login");

    await page.getByLabel("Email").fill("admin_e2e@test.com");
    await page.getByLabel("Senha").fill("password123");

    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });

  test("Should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("errado@teste.com");
    await page.getByLabel("Senha").fill("senhaerrada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Email ou senha inválidos")).toBeVisible();
  });
});
