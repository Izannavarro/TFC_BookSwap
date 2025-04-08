import bookswap.repository.ExchangeRepository;
import bookswap.repository.UserRepository;
import bookswap.repository.BookRepository;
import bookswap.repository.ChatRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.apache.commons.codec.digest.DigestUtils;


@RestController
public class Controller {
	
	/**
	 * ArrayList where active user's tokens will be stored
	 */
	private ArrayList<String> tokens = new ArrayList<String>();
	
	/**
	 * Repository where the queries that interact with the user collection are
	 * stored
	 */
	@Autowired
	private UserRepository userRepository;
	
	/**
	 * Repository where the queries that interact with the exchange collection are
	 * stored
	 */
	@Autowired
	private ExchangeRepository exchangeRepository;
	
	/**
	 * Repository where the queries that interact with the chat collection are
	 * stored
	 */
	@Autowired
	private ChatRepository chatRepository;
	
	/**
	 * Repository where the queries that interact with the book collection are
	 * stored
	 */
	@Autowired
	private BookRepository bookRepository;
	
	
	
	/**
	 * @param userDTO Object with the new user's username and password
	 * @return HttpStatus NOT_FOUND if the user is not present, or HttpStatus OK if
	 *         user is found and credentials match
	 */
	@PostMapping("imgini/login")
	public ResponseEntity<Object> login(@RequestBody UserDTO userDTO) {
		String passwordHash = DigestUtils.sha256Hex(userDTO.getPassword());
		Optional<User> user = userRepository.findByUserAndPassword(userDTO.getUsername(), passwordHash);
		if (user.isPresent()) {
			String uuid = UUID.randomUUID().toString();
			String token = uuid.split("-")[0];
			tokens.add(token);
			return ResponseEntity.status(HttpStatus.OK).body(token);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
	

}
