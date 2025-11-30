import {test, expect} from "@playwright/test";

test.describe("Navigation", () => {
    test.beforeEach(async ({page, request}) => {
        await request
            .post("http://localhost:3000/auth/register", {
                data: {
                    name: "Nav Tester",
                    email: "nav@test.com",
                    password: "123456",
                },
                ignoreHTTPSErrors: true,
            })
            .catch(() => {});

        await page.goto("/login");
        await page.getByLabel("Email").fill("nav@test.com");
        await page.getByLabel("Senha").fill("123456");
        await page.getByRole("button", {name: "Entrar"}).click();
        await expect(page).toHaveURL("/");
    });

    test("Should navigate to Clients page", async ({page}) => {
        await page.getByRole("link", {name: "Clientes"}).click();

        await expect(page).toHaveURL("/clients");
        await expect(
            page.getByRole("heading", {name: "Clientes"})
        ).toBeVisible();

        await expect(page.locator("table")).toBeVisible();
    });

    test("Should navigate to Orders page", async ({page}) => {
        await page.getByRole("link", {name: "Ordens de Serviço"}).click();
        await expect(page).toHaveURL("/orders");
        await expect(
            page.getByRole("heading", {name: "Ordens de Serviço"})
        ).toBeVisible();
    });
});
