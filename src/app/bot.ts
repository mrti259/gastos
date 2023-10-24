import {
  APP_URL,
  CATEGORIAS_ID,
  CUOTAS_ID,
  GASTOS_ID,
  NOTION_TOKEN,
  SECRET_TOKEN,
  TELEGRAM_TOKEN,
  USUARIOS_ID,
} from "./constants";
import { Bot } from "./gastos/Bot";

export const bot = new Bot({
  app_url: APP_URL,
  secret_token: SECRET_TOKEN,
  telegram_token: TELEGRAM_TOKEN,
  storage: {
    token: NOTION_TOKEN,
    categorias_id: CATEGORIAS_ID,
    gastos_id: GASTOS_ID,
    cuotas_id: CUOTAS_ID,
    usuarios_id: USUARIOS_ID,
  },
});
