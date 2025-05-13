package bookswap.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import bookswap.model.entity.Book;

public interface BookRepository extends MongoRepository<Book, String> {

	List<Book> findByOwnerUsername(String ownerUsername);

	Optional<Book> findByTitleAndOwnerUsername(String title, String ownerUsername);
}
