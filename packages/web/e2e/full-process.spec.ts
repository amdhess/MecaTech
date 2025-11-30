import {test, expect} from "@playwright/test";

test.setTimeout(60000);

const timestamp = Date.now();
const clientName = `Cliente Auto ${timestamp}`;
const vehiclePlate = `TST-${timestamp.toString().slice(-4)}`;
const partName = `Peça Auto ${timestamp}`;
const serviceName = `Mão de Obra ${timestamp}`;

test.describe("Full Workshop Process", () => {
    test.beforeEach(async ({page, request}) => {
        await request
            .post("http://localhost:3000/auth/register", {
                data: {
                    name: "Admin Flow",
                    email: "flow@test.com",
                    password: "123456",
                },
                ignoreHTTPSErrors: true,
            })
            .catch(() => {});

        await page.goto("/login");
        await page.getByLabel("Email").fill("flow@test.com");
        await page.getByLabel("Senha").fill("123456");
        await page.getByRole("button", {name: "Entrar"}).click();
        await expect(page).toHaveURL("/");
    });

    test("Should complete the full CRUD flow including Services", async ({
        page,
    }) => {
        await test.step("Create Client", async () => {
            await page.getByRole("link", {name: "Clientes"}).click();
            await page.getByRole("button", {name: "Novo Cliente"}).click();

            await page.getByLabel("Nome Completo").fill(clientName);
            await page
                .getByLabel("Email")
                .fill(`cliente${timestamp}@email.com`);
            await page.getByLabel("Telefone").fill("1199999999");

            await page.locator('button[type="submit"]').click();
            await expect(page.getByText(clientName)).toBeVisible();
        });

        await test.step("Create Vehicle", async () => {
            await page.getByRole("link", {name: "Veículos"}).click();
            await page.getByRole("button", {name: "Novo Veículo"}).click();

            const select = page.getByLabel("Proprietário");
            try {
                await select.selectOption({label: clientName});
            } catch {
                const options = await select.locator("option").all();
                const lastValue = await options[
                    options.length - 1
                ].getAttribute("value");
                if (lastValue) await select.selectOption(lastValue);
            }

            await page.getByLabel("Placa").fill(vehiclePlate);
            await page.getByLabel("Ano").fill("2022");
            await page.getByLabel("Modelo").fill("Cronos");
            await page.getByLabel("Marca").fill("Fiat");
            await page.getByLabel("Cor").fill("Prata");

            await page.locator('button[type="submit"]').click();
            await expect(page.getByText(vehiclePlate)).toBeVisible();
        });

        await test.step("Create Part", async () => {
            await page.getByRole("link", {name: "Estoque"}).click();
            await page.getByRole("button", {name: "Nova Peça"}).click();

            await page.getByLabel("Nome da Peça").fill(partName);
            await page.getByLabel("SKU").fill(`SKU-${timestamp}`);
            await page.getByLabel("Estoque").fill("100");
            await page.getByLabel("Preço (R$)").fill("50.00");

            await page.locator('button[type="submit"]').click();
            await expect(page.getByText(partName)).toBeVisible();
        });

        await test.step("Create Service", async () => {
            await page.getByRole("link", {name: "Serviços"}).click();
            await page.getByRole("button", {name: "Novo Serviço"}).click();

            await page.getByLabel("Nome do Serviço").fill(serviceName);
            await page.getByLabel("Preço Mão de Obra").fill("150.00");

            await page.locator('button[type="submit"]').click();
            await expect(page.getByText(serviceName)).toBeVisible();
        });

        await test.step("Create Service Order", async () => {
            await page.getByRole("link", {name: "Ordens de Serviço"}).click();
            await page.getByRole("link", {name: "Nova OS"}).click();

            const vehicleSelect = page.getByLabel("Veículo / Cliente");
            await vehicleSelect.click();
            const optionValue = await page
                .locator("option", {hasText: vehiclePlate})
                .getAttribute("value");
            if (optionValue) {
                await vehicleSelect.selectOption(optionValue);
            } else {
                const options = await vehicleSelect.locator("option").all();
                const lastVal = await options[options.length - 1].getAttribute(
                    "value"
                );
                if (lastVal) await vehicleSelect.selectOption(lastVal);
            }

            await page
                .locator("label")
                .filter({hasText: serviceName})
                .locator('input[type="checkbox"]')
                .check();

            await page.getByRole("button", {name: "Adicionar Peça"}).click();

            const partSelect = page.locator("select").nth(1);
            const partOptionValue = await page
                .locator("option", {hasText: partName})
                .getAttribute("value");

            if (partOptionValue) {
                await partSelect.selectOption(partOptionValue);
            } else {
                const pOptions = await partSelect.locator("option").all();
                const pVal = await pOptions[pOptions.length - 1].getAttribute(
                    "value"
                );
                if (pVal) await partSelect.selectOption(pVal);
            }

            await page.locator('input[type="number"]').fill("2");

            await page.locator('button[type="submit"]').click();

            await expect(page).toHaveURL("/orders");
            await expect(page.getByText(vehiclePlate)).toBeVisible();

            await expect(page.locator("body")).toContainText("250,00");
        });
    });
});
