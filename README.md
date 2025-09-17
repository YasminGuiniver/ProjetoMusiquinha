# ProjetoMusiquinha

- **Jhenifer Lorrane Anacleto Rodrigues** - RA: 01241018
- **Yasmin Guiniver Silva Patrocinio** - RA: 01241072

Repositório: [https://github.com/YasminGuiniver/ProjetoMusiquinha](https://github.com/YasminGuiniver/ProjetoMusiquinha)

---

## Como rodar o projeto (`musicConsumidor`)

### Pré-requisitos

- Node.js e npm instalados

### Passos para executar o projeto

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Inicie o servidor**

   ```bash
   npm start
   ```

   > Ou rode diretamente:

   ```bash
    node consumidor.js
   ```

---

## Como rodar o projeto Java (`musicProdutor`) no IntelliJ IDEA

### Pré-requisitos

- Ter o [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) instalado
- Ter o Java 17 ou superior instalado

### Passos para executar o projeto

1. Abra o IntelliJ IDEA e selecione **Open**.
2. Navegue até a pasta `musicProdutor` e selecione-a para abrir o projeto.
3. Aguarde o IntelliJ importar as dependências do Maven automaticamente (veja a aba "Maven" no lado direito ou inferior do IDE).
4. No painel lateral, navegue até:
   - `src/main/java/com/musicProdutor/ProdutorMusic.java`
5. Clique com o botão direito no arquivo `ProdutorMusic.java` e selecione **Run 'ProdutorMusic.main()'**.
6. O servidor Spring Boot será iniciado e estará disponível na porta configurada (por padrão, http://localhost:8080).

> Dica: Você também pode rodar os testes indo até a pasta `src/test/java/com/musicProdutor/` e clicando com o botão direito nos arquivos de teste.

---

---

## Como testar a API com Insomnia/cURL

Você pode cadastrar uma música usando o Insomnia, Postman ou cURL com o seguinte comando:

```bash
curl --request POST \
   --url http://localhost:8080/musicas \
   --header 'Content-Type: application/json' \
   --data '{
      "genero": "Genero",
      "titulo": "Titulo",
      "cantor": "Nome do Cantor(a)"
}'
```

No Insomnia ou Postman:

- Método: **POST**
- URL: `http://localhost:8080/musicas`
- Body: (JSON)
  ```json
  {
    "genero": "Genero",
    "titulo": "Titulo",
    "cantor": "Nome do Cantor(a)"
  }
  ```

---

## Como visualizar no front-end

Basta clicar no botão **Recarregar músicas** na interface web para ver as músicas cadastradas.

---

- Caso queira rodar em modo de desenvolvimento, utilize ferramentas como [nodemon](https://www.npmjs.com/package/nodemon).
- Certifique-se de estar na pasta correta (`musicConsumidor`) ao rodar os comandos.
