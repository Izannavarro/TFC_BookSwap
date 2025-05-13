package bookswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import bookswap.model.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
	
	@Query("{ 'username': ?0, 'password': ?1 }")
	Optional<User> findByUserAndPassword(String username, String password);
	
	@Query(value = "{ 'username': ?0 }")
	Optional<User> getUserByName(String name);
	
	 // Encontrar todos los usuarios (sin incluir al usuario actual)
    List<User> findByUsernameNot(String username);
}