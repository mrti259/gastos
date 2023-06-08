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
