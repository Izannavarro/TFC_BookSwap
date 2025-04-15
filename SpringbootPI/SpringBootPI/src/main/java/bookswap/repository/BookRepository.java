import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import bookswap.model.entity.Book;

public interface BookRepository extends MongoRepository<Book, String> {

    // 1. Obtener todos los libros de un owner_id específico
    @Query("{ 'owner_id': ?0 }")
    List<Book> findByOwnerId(String ownerId);

    // 2. Obtener libros de un owner_id específico ordenados por fecha de publicación (más reciente a más antigua)
    @Query(value = "{ 'owner_id': ?0 }", sort = "{ 'publication_date': -1 }")
    List<Book> findByOwnerIdOrderByPublicationDateDesc(String ownerId);
    
}
