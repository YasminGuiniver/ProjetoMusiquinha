package com.musicProdutor;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/musicas")
public class MusicaController {

    private static final Logger logger = LoggerFactory.getLogger(MusicaController.class);


    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${broker.queue.name}")
    private String queueName;

    @PostMapping
    public ResponseEntity<?> enviarMusica(@RequestBody MusicaDTO musica) {
        logger.info("Recebida requisição POST /musicas com payload: {}", musica);
        try {
            rabbitTemplate.convertAndSend(queueName, musica);
            logger.info("Música enviada para a fila: {}", musica);
            logger.info("Resposta retornada: {}", musica);
            return ResponseEntity.ok(musica);
        } catch (Exception e) {
            logger.error("Erro ao enviar música para a fila: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar música para a fila.");
        }
    }


//    // Endpoint para testar a busca de todas as músicas da fila
//    @GetMapping
//    public ResponseEntity<?> getMusicaDaFila() {
//        logger.info("Recebida requisição GET /musicas para buscar todas da fila");
//        try {
//            java.util.List<Object> musicas = new java.util.ArrayList<>();
//            Object musica;
//            while ((musica = rabbitTemplate.receiveAndConvert(queueName)) != null) {
//                logger.info("Música recuperada da fila: {}", musica);
//                musicas.add(musica);
//            }
//            if (musicas.isEmpty()) {
//                logger.info("Nenhuma música encontrada na fila.");
//                return ResponseEntity.ok().body("Nenhuma música na fila.");
//            }
//            return ResponseEntity.ok(musicas);
//        } catch (org.springframework.amqp.AmqpIOException e) {
//            logger.error("Erro ao buscar músicas da fila: {}", e.getMessage(), e);
//            if (e.getCause() != null && e.getCause().getMessage() != null && e.getCause().getMessage().contains("no queue")) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fila não encontrada. Certifique-se que a fila foi criada.");
//            }
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Erro ao buscar músicas da fila.");
//        } catch (Exception e) {
//            logger.error("Erro ao buscar músicas da fila: {}", e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Erro ao buscar músicas da fila.");
//        }
//    }
}
