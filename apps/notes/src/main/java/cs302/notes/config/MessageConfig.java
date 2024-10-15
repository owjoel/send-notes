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
    private String topicExchangeName;

    @Value("${rabbitmq.orders.created.queue}")
    private String createdQueueString;

    @Value("${rabbitmq.orders.success.queue}")
    private String successQueueString;
    
    @Value("${rabbitmq.orders.created.rk}")
    private String orderCreatedRk;

    @Value("${rabbitmq.orders.success.rk}")
    private String orderSuccessRk;

    @Bean
    Queue createQueue() {
        return new Queue(createdQueueString, true);
    }

    @Bean
    Queue successQueue() {
        return new Queue(successQueueString, true);
    }

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(topicExchangeName);
    }

    @Bean
    Binding binding1(Queue createQueue, TopicExchange exchange) {
        return BindingBuilder.bind(createQueue).to(exchange).with(orderCreatedRk);
    }
    @Bean
    Binding binding2(Queue successQueue, TopicExchange exchange) {
        return BindingBuilder.bind(successQueue).to(exchange).with(orderSuccessRk);
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
