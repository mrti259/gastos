import { Telegram } from "../telegram/Telegram";
import { Storage } from "./Storage";
import { ConfigStorage, NuevoGasto } from "./types";

type BotConfig = {
  app_url: string;
  secret_token: string;
  telegram_token: string;
  storage: ConfigStorage;
};

type TChat = {
  id: number;
  first_name?: string;
  last_name?: string;
};

type TMessage = {
  chat: TChat;
  text: string;
};

export class Bot {
  private telegram: Telegram;
  private storage: Storage;

  constructor(private config: BotConfig) {
    this.telegram = new Telegram(config.telegram_token, ["message"]);
    this.storage = Storage.nuevo(config.storage);
  }

  async getUpdates() {
    await this.telegram.deleteWebhook();
    const updates = await this.telegram.getUpdates();
    for (const update of updates) {
      await this.handleUpdate(update);
    }
  }

  async webhookSetter() {
    const url = this.config.app_url + "/api/webhook";
    const secret_token = this.config.secret_token;
    const response = await this.telegram.setWebhook({
      url,
      secret_token,
    });
    return response;
  }

  async webhookHandler(
    headers: Record<string, string | string[] | undefined>,
    body: {
      update_id: number;
      message?: TMessage;
    },
  ) {
    if (!this.acceptUpdateOrigin(headers)) return;

    const { message } = body;
    if (!message) return;

    await this.handleUpdate(message);

    this.telegram.updateOffset(body.update_id + 1);
  }

  private acceptUpdateOrigin(
    headers: Record<string, string | string[] | undefined>,
  ) {
    const secret_token = headers["x-telegram-bot-api-secret-token"];
    return secret_token === this.config.secret_token;
  }

  private async handleUpdate({ chat, text }: TMessage) {
    const isAuth = this.authenticate(chat);
    if (!isAuth) {
      await this.telegram.sendMessage(
        chat.id,
        "No estás autorizado a usar el bot",
      );
      return;
    }

    const nuevoGasto = this.parseNuevoGasto(text);
    if (!nuevoGasto) {
      await this.telegram.sendMessage(
        chat.id,
        `El texto no se encuentra en el formato correcto:
        
        Descripcion: string
        Total: number
        Cuotas: number
        Categoria: string`,
      );
      return;
    }

    await this.create(nuevoGasto);
    await this.telegram.sendMessage(
      chat.id,
      `Se crearon ${nuevoGasto.cuotas} cuotas para ${nuevoGasto.descripcion}!`,
    );
  }

  private async authenticate(chat: TChat): Promise<boolean> {
    const user = await this.storage.buscarUsuario(chat.id);
    if (user) return user.auth;

    await this.storage.registrarUsuario(chat);
    return false;
  }

  private parseNuevoGasto(text: string): NuevoGasto | null {
    const parts = text.split("\n");
    if (parts.length != 4) return null;
    return {
      descripcion: parts[0],
      total: Number(parts[1]),
      cuotas: Number(parts[2]),
      categoria: parts[3],
    };
  }

  private create(nuevoGasto: NuevoGasto) {
    return this.storage.agregarGasto(nuevoGasto);
  }
}
