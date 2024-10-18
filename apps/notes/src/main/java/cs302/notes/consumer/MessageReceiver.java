package cs302.notes.consumer;

import cs302.notes.models.*;
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
        } catch (Exception e) {
            System.out.println("Error receiving verification");
        }
    }

    @RabbitListener(queues = "${rabbitmq.orders.success.queue}")
    public void receiveMessage(final OrderSuccess request) {
        try {
            System.out.println("Forwarded signed url for notification");
            // Append stuff for notes and forward to eddy
            Notes notes = repository.findBy_id(request.getNotesId())
                    .orElseThrow(() -> new NotesNotFoundException(request.getNotesId()));
            OrdersNotesSuccess ordersNotesSuccess = new OrdersNotesSuccess(request, notes);
            messageSender.publishEmailClients(ordersNotesSuccess);

        } catch (NotesNotFoundException e) {
            System.out.println("Notes no longer found");
        } catch (Exception e) {
            System.out.println("Failed to send out notification");
        }
    }

    @RabbitListener(queues = "${rabbitmq.listings.verified.queue}")
    public void receiveMessage(final ListingStatus request) {
        try {
            System.out.println("Notes verified");
            Notes notes = repository.findBy_id(request.get_id())
                    .orElseThrow(() -> new NotesNotFoundException(request.get_id()));
            notes.setStatus(request.getStatus());
            repository.save(notes);
            messageSender.publishListingCompleted(request);
        } catch (NotesNotFoundException e) {
            System.out.println("Notes no longer found");
        } catch (Exception e) {
            System.out.println("Error receiving verification");
        }
    }
}
