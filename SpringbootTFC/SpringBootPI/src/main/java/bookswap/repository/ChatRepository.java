package bookswap.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import bookswap.model.entity.Chat;

public interface ChatRepository extends MongoRepository<Chat, String>{
	
	// Buscar todos los chats donde un usuario es participante
    @Query("{ 'participants': ?0 }")
    List<Chat> findByParticipantsContaining(String participant);
    
    @Query("{ 'participants': { $all: [?0, ?1] }, $where: 'this.participants.length == 2' }")
    Optional<Chat> findByParticipantsIn(String user1, String user2);
}
