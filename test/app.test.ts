import { Client } from "@notionhq/client";

import { AdministradorDeGastos } from "../src/app/AdministradorDeGastos";
import { Database } from "../src/app/notion/Database";
import { categoriaSchema, cuotaSchema, gastoSchema } from "../src/app/schemas";
import { NuevoGasto } from "../src/app/types";
import { createTestSuite } from "./utils";

let administrador: AdministradorDeGastos;

const [test, xtest] = createTestSuite("Administrador de gastos");

test.before(() => {
  const {
    NOTION_TOKEN,
    NOTION_CATEGORIAS_ID,
    NOTION_GASTOS_ID,
    NOTION_CUOTAS_ID,
  } = process.env;
  const client = new Client({ auth: NOTION_TOKEN });
  administrador = new AdministradorDeGastos(
    new Database(client, NOTION_CATEGORIAS_ID!, categoriaSchema),
    new Database(client, NOTION_GASTOS_ID!, gastoSchema),
    new Database(client, NOTION_CUOTAS_ID!, cuotaSchema),
  );
});

// Puede optimizarse si se encarga el administrador de guardar gastos parecidos
async function agregarGastos(nuevosGastos: NuevoGasto[]) {
  await Promise.all(nuevosGastos.map(administrador.agregarGasto));
}

xtest("Agregar gasto Juego Switch", async () => {
  await administrador.agregarGasto({
    descripcion: "Juego Switch",
    total: 10508.24,
    cuotas: 1,
    categoria: "Switch",
  });
});

xtest("Agregar gasto Standing Desk", async () => {
  await administrador.agregarGasto({
    descripcion: "Standing Desk",
    total: 25790,
    cuotas: 6,
    categoria: "Borja",
  });
});

xtest("Agregar gastos Tan Biónica", async () => {
  const personas = ["Lumo", "Borja", "Fuca", "Joe"];
  const nuevosGastos: NuevoGasto[] = personas.map((persona) => ({
    descripcion: `Tan Biónica ${persona}`,
    total: 18400,
    cuotas: 6,
    categoria: persona,
  }));
  await agregarGastos(nuevosGastos);
});

xtest("Agregar gastos Taylor Swift", async () => {
  const personas = ["Lumo", "Borja"];
  const nuevosGastos: NuevoGasto[] = personas.map((persona) => ({
    descripcion: `Taylor Swift ${persona}`,
    total: 97750,
    cuotas: 6,
    categoria: persona,
  }));
  await agregarGastos(nuevosGastos);
});
