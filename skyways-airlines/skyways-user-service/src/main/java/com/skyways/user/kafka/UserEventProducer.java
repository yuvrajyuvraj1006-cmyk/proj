package com.skyways.user.kafka;

import com.skyways.common.enums.KafkaTopics;
import com.skyways.common.kafka.KafkaEventEnvelope;
import com.skyways.user.entity.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Component
public class UserEventProducer {

    private static final Logger log = LogManager.getLogger(UserEventProducer.class);

    private final KafkaTemplate<String, KafkaEventEnvelope<?>> kafkaTemplate;

    public UserEventProducer(KafkaTemplate<String, KafkaEventEnvelope<?>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishUserRegistered(User user) {
        KafkaEventEnvelope<Map<String, String>> envelope = KafkaEventEnvelope.<Map<String, String>>builder()
            .eventType("USER_REGISTERED")
            .serviceSource("skyways-user-service")
            .payload(Map.of(
                "userId", user.getUserId().toString(),
                "email", user.getEmail(),
                "fullName", user.getFullName()
            ))
            .build();

        CompletableFuture.runAsync(() ->
            kafkaTemplate.send(KafkaTopics.USER_EVENTS, user.getUserId().toString(), envelope)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish USER_REGISTERED event for userId={}: {}",
                            user.getUserId(), ex.getMessage());
                    } else {
                        log.info("Published USER_REGISTERED event [userId={}]", user.getUserId());
                    }
                }));
    }
}
