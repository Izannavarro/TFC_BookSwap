package bookswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import bookswap.model.entity.Exchange;


@Repository
public interface ExchangeRepository extends MongoRepository<Exchange, String> {

    List<Exchange> findByOwnerId(String ownerId);
    
    Optional<Exchange> findByIdAndOwnerId(String id, String ownerId);

    List<Exchange> findByReceiverId(String receiverId);

    List<Exchange> findByReceiverIdAndStatus(String receiverId, String status);

    List<Exchange> findByOwnerIdAndStatus(String ownerId, String status);

}
