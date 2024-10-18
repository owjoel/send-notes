package cs302.notes.producer;

import cs302.notes.models.ListingStatus;
import cs302.notes.models.OrderCreated;
import cs302.notes.models.OrderSuccess;
import cs302.notes.models.OrdersNotesSuccess;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MessageSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.orders.exchange}")
    private String ordersExchange;

    @Value("${rabbitmq.listings.exchange}")
    private String listingsExchange;


    // ORDERS
    public void publishNotesMissing(OrderCreated message) {
        rabbitTemplate.convertAndSend(ordersExchange, "orders.notes.missing", message);
    }

    public void publishNotesFound(OrderCreated message) {
        rabbitTemplate.convertAndSend(ordersExchange, "orders.notes.found", message);
    }

    // Take info from Orders service and append information about notes (everything except id)
    public void publishEmailClients(OrdersNotesSuccess message) {
        rabbitTemplate.convertAndSend(ordersExchange, "orders.email", message);
    }



    // LISTINGS
    public void publishListingUploaded(ListingStatus message) {
        rabbitTemplate.convertAndSend(listingsExchange, "listings.uploaded", message);
    }

    public void publishListingCompleted(ListingStatus message) {
        rabbitTemplate.convertAndSend(listingsExchange, "listings.completed", message);
    }
}
