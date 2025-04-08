
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import imgini.model.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
	
	@Query("{ 'username': ?0, 'password': ?1 }")
	Optional<User> findByUserAndPassword(String username, String password);
	
	@Query(value = "{ 'username': ?0 }")
	Optional<User> getUserByName(String name);
	
	@Query(value = "{ 'id': ?0 }")
	Optional<User> getUserById(Integer id);
	
	Optional<User> findTopByOrderByIdDesc();
}