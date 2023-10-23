export type ConfigStorage = {
  token: string;
  categorias_id: string;
  gastos_id: string;
  cuotas_id: string;
  usuarios_id: string;
};

export type NuevoGasto = {
  descripcion: string;
  total: number;
  cuotas: number;
  categoria: string;
};

export type Categoria = {
  nombre: string;
};

export type Gasto = {
  descripcion: string;
  total: number;
  cuotas: number;
  id_categoria: string;
};

export type Cuota = {
  descripcion: string;
  id_gasto: string;
};

export type Usuario = {
  nombre: string;
  chat_id: number;
  auth: boolean;
};
