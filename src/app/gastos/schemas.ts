import {
  CheckboxProperty,
  NumberProperty,
  RelationWithOneProperty,
  Schema,
  TitleProperty,
} from "dbotion";

import { Categoria, Cuota, Gasto, Usuario } from "./types";

export const categoriaSchema = new Schema<Categoria>({
  nombre: new TitleProperty("Nombre"),
});

export const gastoSchema = new Schema<Gasto>({
  descripcion: new TitleProperty("Descripción"),
  id_categoria: new RelationWithOneProperty("Categoría"),
  total: new NumberProperty("Total"),
  cuotas: new NumberProperty("Cantidad"),
});

export const cuotaSchema = new Schema<Cuota>({
  descripcion: new TitleProperty("Descripción"),
  id_gasto: new RelationWithOneProperty("Gasto"),
});

export const usuarioSchema = new Schema<Usuario>({
  nombre: new TitleProperty("Nombre"),
  chat_id: new NumberProperty("Chat Id"),
  auth: new CheckboxProperty("Auth"),
});
