import express from "express";
import amqp from "amqplib";
import cors from "cors";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
const QUEUE = "musicas";
const musicasHistorico = [];

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      res.status(500).send("Erro ao carregar a página.");
      return;
    }
    const newHtml = html.replace("{{musicasHtml}}", "");
    res.send(newHtml);
  });
});

app.get("/musicas", async (req, res) => {
  try {
    console.log("[DEBUG] Iniciando busca de músicas no RabbitMQ...");
    const connection = await amqp.connect("amqp://myuser:secret@localhost");
    console.log("[DEBUG] Conexão com RabbitMQ estabelecida.");
    const channel = await connection.createChannel();
    console.log("[DEBUG] Canal criado.");
    await channel.assertQueue(QUEUE, { durable: true });
    console.log("[DEBUG] Fila 'musicas' verificada.");

    let msg;
    do {
      msg = await channel.get(QUEUE, { noAck: true });
      if (msg) {
        try {
          const musicaObj = JSON.parse(msg.content.toString());
          musicasHistorico.push(musicaObj);
          console.log(
            "[DEBUG] Música recebida e adicionada ao histórico:",
            musicaObj
          );
        } catch (e) {
          console.error("[ERRO] Falha ao fazer parse da música:", e);
        }
      }
    } while (msg);

    await channel.close();
    await connection.close();
    console.log("[DEBUG] Canal e conexão fechados.");

    let musicasHtml = "";
    if (musicasHistorico.length > 0) {
      musicasHtml = `
        <div style="max-width:420px;margin:0;padding:0 25px 25px 25px;">
          <h2 style="color:#6a1b9a;text-align:left;margin-bottom:18px;display:flex;align-items:center;gap:8px;font-size:2rem;">
            Músicas Recebidas
          </h2>
          ${musicasHistorico
            .map(
              (musica) => `
                <div style="background:#fff;border-radius:12px;box-shadow:0 1px 6px #f8bbd0;padding:16px 18px;margin-bottom:16px;">
                  <div style="color:#4527a0;font-weight:bold;font-size:1.1rem;margin-bottom:4px;">
                    <span style='font-size:1.2rem;'>🎶</span> <b>Título:</b> <span style='font-weight:normal;color:#222;'>${
                      musica.titulo || "-"
                    }</span>
                  </div>
                  <div style="color:#4527a0;font-weight:bold;margin-bottom:2px;">
                    <span style='font-size:1.1rem;'>👤</span> <b>Cantor:</b> <span style='font-weight:normal;color:#222;'>${
                      musica.cantor || "-"
                    }</span>
                  </div>
                  <div style="color:#4527a0;font-weight:bold;">
                    <span style='font-size:1.1rem;'>🏷️</span> <b>Gênero:</b> <span style='font-weight:normal;color:#222;'>${
                      musica.genero || "-"
                    }</span>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      `;
    } else {
      musicasHtml = "Nenhuma música encontrada.";
    }

    console.log("[DEBUG] HTML gerado para resposta:", musicasHtml);
    res.send(musicasHtml);
  } catch (error) {
    console.error("[ERRO] Falha ao buscar músicas:", error);
    res.status(500).send("Erro ao buscar músicas.");
  }
});

app.listen(3000, () => {
  console.log("Servidor consumidor rodando em http://localhost:3000");
});
