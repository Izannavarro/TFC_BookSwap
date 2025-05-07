import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import bookswap.model.entity.Book;

public interface BookRepository extends MongoRepository<Book, String> {

	// 1. Obtener todos los libros de un owner_username específico
	@Query("{ 'owner_username': ?0 }")
	List<Book> findByOwnerUsername(String ownerUsername);

	// Buscar los libros por su id de propietario (owner_id)
    List<Book> findByOwnerId(String ownerId);
    
}
