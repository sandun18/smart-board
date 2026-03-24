package com.sbms.sbms_monolith.config;


import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "sbms.rabbitmq.enabled", havingValue = "true")
public class RabbitMQConfig {

    @Value("${sbms.rabbitmq.exchange:sbms.events}")
    private String exchangeName;

    @Bean
    public TopicExchange eventExchange() {
        return new TopicExchange(exchangeName, true, false);
    }

    // Use Jackson2JsonMessageConverter without deprecated constructors.
    // It will use Spring's shared ObjectMapper if present.
    @Bean
    public MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
    
    @Bean
    public Queue emergencyQueue() {
        return new Queue("emergency.queue", true);
    }

    @Bean
    public Binding emergencyBinding(
            Queue emergencyQueue,
            TopicExchange eventExchange
    ) {
        return BindingBuilder
                .bind(emergencyQueue)
                .to(eventExchange)
                .with("emergency.*");
    }

}
