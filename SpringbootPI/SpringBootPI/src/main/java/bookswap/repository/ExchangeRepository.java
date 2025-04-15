import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


public class ExchangeRepository extends MongoRepository<Exchange, String> {
	
		// Obtener intercambios por owner_id
	    @Query("{ 'owner_id' : ?0 }")
	    List<Exchange> findByOwnerId(String ownerId);
	    
	    //Conseguir Exchange por fecha específica y owner_id
	    @Query("{ 'exchangeDate' : ?0, 'ownerId' : ?1 }")
	    List<Exchange> findByExchangeDateAndOwnerId(String exchangeDate, String ownerId);
	    
	    // Encontrar intercambios donde el receiver_id sea el del usuario (pendientes)
	    List<Exchange> findByReceiver_idAndStatus(String receiverId, String status);
	    
	    // Encontrar intercambios creados por el owner (pendientes)
	    List<Exchange> findByOwner_idAndStatus(String ownerId, String status);
}
