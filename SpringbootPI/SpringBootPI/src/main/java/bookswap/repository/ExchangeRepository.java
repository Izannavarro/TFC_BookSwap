import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeRepository extends MongoRepository<Exchange, String> {

    @Query("{ 'owner_id' : ?0 }")
    List<Exchange> findByOwnerId(String ownerId);

    List<Exchange> findByReceiverId(String receiverId);

    List<Exchange> findByReceiverIdAndStatus(String receiverId, String status);

    List<Exchange> findByOwnerIdAndStatus(String ownerId, String status);

}
