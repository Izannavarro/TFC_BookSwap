
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import bookswap.model.entity.Chat;

public class ChatRepository extends MongoRepository<Chat, String>{
	
	// Buscar todos los chats donde un usuario es participante
    @Query("{ 'participant': ?0 }")
    List<Chat> findByParticipantsContaining(String participant);
    
    // Buscar un chat específico con exactamente esos dos participantes (en cualquier orden)
    @Query("{ 'participants': { $all: [?0, ?1] } }")
    Optional<Chat> findByParticipants(String userId1, String userId2);
}
