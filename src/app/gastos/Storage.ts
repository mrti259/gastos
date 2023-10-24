import { Client } from "@notionhq/client";

import { Database, Identificable } from "../notion/Database";
import {
  categoriaSchema,
  cuotaSchema,
  gastoSchema,
  usuarioSchema,
} from "./schemas";
import {
  Categoria,
  ConfigStorage,
  Cuota,
  Gasto,
  NuevoGasto,
  Usuario,
} from "./types";

export class Storage {
  constructor(
    private categorias: Database<Categoria>,
    private gastos: Database<Gasto>,
    private cuotas: Database<Cuota>,
    private usuarios: Database<Usuario>,
  ) {}

  async agregarGasto(nuevoGasto: NuevoGasto) {
    const categoria = await this.obtenerCategoria(nuevoGasto.categoria);
    const gasto: Gasto = {
      descripcion: nuevoGasto.descripcion,
      total: nuevoGasto.total,
      cuotas: nuevoGasto.cuotas,
      id_categoria: categoria.id,
    };
    const gastoCreado = await this.crearGasto(gasto);
    const cuotas = await this.crearCuotasParaGasto(gastoCreado);
    return { cuotas: cuotas.map(({ descripcion }) => ({ descripcion })) };
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

  async registrarUsuario(chat: {
    id: number;
    first_name?: string | undefined;
    last_name?: string | undefined;
  }): Promise<Usuario | undefined> {
    const nuevoUsuario: Usuario = {
      nombre: [chat.first_name, chat.last_name].join(" ").trim(),
      chat_id: chat.id,
      auth: false,
    };
    const usuariosCreados = await this.usuarios.create([nuevoUsuario]);
    return usuariosCreados[0];
  }

  async buscarUsuario(chat_id: number): Promise<Usuario | undefined> {
    const usuarios = await this.usuarios.query({ chat_id: [chat_id] });
    return usuarios[0];
  }

  public static nuevo(config: ConfigStorage) {
    const client = new Client({ auth: config.token });
    return new this(
      new Database(client, config.categorias_id, categoriaSchema),
      new Database(client, config.gastos_id, gastoSchema),
      new Database(client, config.cuotas_id, cuotaSchema),
      new Database(client, config.usuarios_id, usuarioSchema),
    );
  }
}
