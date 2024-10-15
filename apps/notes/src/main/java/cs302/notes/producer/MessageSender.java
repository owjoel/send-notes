package cs302.notes.producer;

import cs302.notes.models.OrderCreated;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MessageSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.orders.exchange}")
    private String topicExchangeName;

    @Value("rabbitmq.orders.created.rk")
    private String orderCreatedRk;

    @Value("${rabbitmq.orders.notes-found.rk}")
    private String notesFoundRk;

    @Value("${rabbitmq.orders.notes-missing.rk}")
    private String notesMissingRk;



    public void publishNotesMissing(OrderCreated message) {
        rabbitTemplate.convertAndSend(topicExchangeName, notesMissingRk, message);
    }

    public void publishNotesFound(OrderCreated message) {
        rabbitTemplate.convertAndSend(topicExchangeName, notesFoundRk, message);
    }
}
