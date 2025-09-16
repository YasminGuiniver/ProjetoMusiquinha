import express from "express";
import fetch from "node-fetch"; 

const app = express();
const cantoresArmazenados = []; 


app.get("/cantor", async (req, res) => {
  const nomeCantor = req.query.nomeCantor;

  try {
   
    const resposta = await fetch("http://localhost:8080/cantor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeCantor }),
    });

    const dados = await resposta.text();

   
    cantoresArmazenados.push({
      nome: nomeCantor,
      respostaSpring: dados,
      data: new Date().toISOString(),
    });

    res.send({ msg: "Cantor salvo e enviado ao Spring!", retorno: dados });
  } catch (error) {
    res.status(500).send({ erro: error.message });
  }
});


app.get("/cantores", (req, res) => {
  res.json(cantoresArmazenados);
});

app.listen(3000, () => {
  console.log("Node rodando em http://localhost:3000");
});
