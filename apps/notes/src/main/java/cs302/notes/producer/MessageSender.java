package cs302.notes.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import cs302.notes.data.messages.TestMessage;

@Component
public class MessageSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.orders.exchange}")
    private String topicExchangeName;

    @Value("${rabbitmq.orders.notes-found.rk}")
    private String notesFoundRk;

    @Value("${rabbitmq.orders.notes-missing.rk}")
    private String notesMissingRk;

    public void publishNotesMissing(TestMessage message) {
        rabbitTemplate.convertAndSend(topicExchangeName, notesFoundRk, message);
    }

    public void publishNotesFound(TestMessage message) {
        rabbitTemplate.convertAndSend(topicExchangeName, notesMissingRk, message);
    }
}
