package cs302.notes.consumer;

import cs302.notes.models.OrderCreated;
import cs302.notes.exceptions.NotesNotFoundException;
import cs302.notes.producer.MessageSender;
import cs302.notes.repository.NotesRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MessageReceiver {

    private final NotesRepository repository;
    private final MessageSender messageSender;

    public MessageReceiver(NotesRepository repository, MessageSender messageSender) {
        this.repository = repository;
        this.messageSender = messageSender;
    }

    @RabbitListener(queues = "${rabbitmq.orders.created.queue}")
    public void receiveMessage(final OrderCreated request) {
        try {
            repository.findBy_id(request.getNoteId()).orElseThrow(() -> new NotesNotFoundException(request.getNoteId()));
            messageSender.publishNotesFound(request);
        } catch (NotesNotFoundException e) {
            messageSender.publishNotesMissing(request);
        }
    }
}
