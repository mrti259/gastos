import { Database, Identificable } from "./notion/Database";
import { Categoria, Cuota, Gasto, NuevoGasto } from "./types";

export class AdministradorDeGastos {
  constructor(
    private categorias: Database<Categoria>,
    private gastos: Database<Gasto>,
    private cuotas: Database<Cuota>,
  ) {}

  async agregarGasto(nuevoGasto: NuevoGasto) {
    const categoria: Identificable<Categoria> = await this.obtenerCategoria(
      nuevoGasto.categoria,
    );
    const gasto: Gasto = {
      descripcion: nuevoGasto.descripcion,
      total: nuevoGasto.total,
      cuotas: nuevoGasto.cuotas,
      id_categoria: categoria.id,
    };
    const gastoCreado = await this.crearGasto(gasto);
    await this.crearCuotasParaGasto(gastoCreado);
    return gastoCreado;
  }

  private async obtenerCategoria(
    categoria: string,
  ): Promise<Identificable<Categoria>> {
    let categorias = await this.categorias.query({ nombre: [categoria] });
    if (!categorias.length) {
      categorias = await this.categorias.create([{ nombre: categoria }]);
    }
    return categorias[0];
  }

  private async crearGasto(gasto: Gasto): Promise<Identificable<Gasto>> {
    const gastos = await this.gastos.create([gasto]);
    return gastos[0];
  }

  private async crearCuotasParaGasto(
    gasto: Identificable<Gasto>,
  ): Promise<Array<Cuota>> {
    const cuotasACrear: Array<Cuota> = [];
    for (let numeroCuota = 1; numeroCuota <= gasto.cuotas; numeroCuota++) {
      cuotasACrear.push({
        descripcion: `${gasto.descripcion} ${numeroCuota}/${gasto.cuotas}`,
        id_gasto: gasto.id,
      });
    }
    return await this.cuotas.create(cuotasACrear);
  }
}
