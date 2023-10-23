import { Storage } from "../../../src/app/gastos/Storage";
import { NuevoGasto } from "../../../src/app/gastos/types";
import { createTestSuite } from "../../utils";

let storage: Storage;

const [test, xtest] = createTestSuite("Storage");

test.before(() => {
  const {
    NOTION_TOKEN,
    NOTION_CATEGORIAS_ID,
    NOTION_GASTOS_ID,
    NOTION_CUOTAS_ID,
  } = process.env;
  storage = Storage.nuevo({
    token: NOTION_TOKEN!,
    categorias_id: NOTION_CATEGORIAS_ID!,
    gastos_id: NOTION_GASTOS_ID!,
    cuotas_id: NOTION_CUOTAS_ID!,
    usuarios_id: null!,
  });
});

// Puede optimizarse si se encarga el storage de guardar gastos parecidos
async function agregarGastos(nuevosGastos: NuevoGasto[]) {
  await Promise.all(nuevosGastos.map(storage.agregarGasto));
}

xtest("Agregar gasto regalo madre", async () => {
  await storage.agregarGasto({
    descripcion: "Regalo madre",
    total: 18890,
    cuotas: 3,
    categoria: "Borja",
  });
});

xtest("Agregar gasto parlante", async () => {
  await storage.agregarGasto({
    descripcion: "Parlante",
    total: 20850.46,
    cuotas: 6,
    categoria: "Borja",
  });
});

xtest("Agregar gasto Juego Switch", async () => {
  await storage.agregarGasto({
    descripcion: "Juego Switch",
    total: 10508.24,
    cuotas: 1,
    categoria: "Switch",
  });
});

xtest("Agregar gasto Standing Desk", async () => {
  await storage.agregarGasto({
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
