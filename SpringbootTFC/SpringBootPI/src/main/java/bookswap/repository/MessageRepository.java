package bookswap.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import bookswap.model.entity.Message;

public interface MessageRepository extends MongoRepository<Message, String> {

    // Método para encontrar los mensajes por chatId y ordenarlos por timestamp
    List<Message> findByChatIdOrderByTimestampAsc(String chatId);

    // Método para encontrar los mensajes por chatId y receiverId, y filtrarlos por estado
    List<Message> findByChatIdAndReceiverIdAndStatus(String chatId, String receiverId, String status);

    // Método para encontrar todos los mensajes por un senderId y un receiverId
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
}
