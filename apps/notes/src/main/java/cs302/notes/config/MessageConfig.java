package cs302.notes.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    @Value("${rabbitmq.orders.exchange}")
    private String ordersExchangeName;

    @Value("${rabbitmq.listings.exchange}")
    private String listingsExchangeName;

    @Value("${rabbitmq.orders.created.queue}")
    private String createdQueueString;

    @Value("${rabbitmq.orders.success.queue}")
    private String successQueueString;

    @Value("${rabbitmq.listings.verified.queue}")
    private String verifiedQueueString;

    @Bean
    Queue createQueue() {
        return new Queue(createdQueueString);
    }

    @Bean
    Queue successQueue() {
        return new Queue(successQueueString);
    }

    @Bean
    Queue verifiedQueue() {
        return new Queue(verifiedQueueString);
    }

    @Bean
    TopicExchange ordersExchange() {
        return new TopicExchange(ordersExchangeName);
    }

    @Bean
    TopicExchange listingsExchange() {
        return new TopicExchange(listingsExchangeName);
    }

    /**
     * Creates a binding of queue "order-created" to exchange "orders" with routing key "orders.created"
     */
    @Bean
    Binding binding1(Queue createQueue, TopicExchange ordersExchange) {
        return BindingBuilder.bind(createQueue).to(ordersExchange).with("orders.created");
    }

    /**
     * Creates a binding of queue "order-success" to exchange "orders" with routing key "orders.success"
     */
    @Bean
    Binding binding2(Queue successQueue, TopicExchange ordersExchange) {
        return BindingBuilder.bind(successQueue).to(ordersExchange).with("orders.success");
    }

    /**
     * Creates a binding of queue "order-success" to exchange "orders" with routing key "orders.success"
     */
    @Bean
    Binding binding3(Queue verifiedQueue, TopicExchange listingsExchange) {
        return BindingBuilder.bind(verifiedQueue).to(listingsExchange).with("listings.verified");
    }

    @Bean
    public MessageConverter converter(){
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;
    }
}
