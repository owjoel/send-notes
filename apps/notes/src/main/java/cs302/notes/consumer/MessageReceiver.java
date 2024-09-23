package cs302.notes.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import cs302.notes.data.messages.TestMessage;

@Component
public class MessageReceiver {

    @RabbitListener(queues = "${rabbitmq.orders.created.queue}")
    public void receiveMessage(final TestMessage message) {
        System.out.println(message.getName());
    }
}
