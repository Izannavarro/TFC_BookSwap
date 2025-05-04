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
import bookswap.dto.UserDTO;
import bookswap.dto.UserInfo;
import bookswap.dto.GeocodeResponseDTO;
import bookswap.model.User;
import bookswap.model.Book;
import bookswap.model.UserInfo;
import bookswap.utils.Utilities;

@RestController
public class Controller {
	
	/**
	 * ArrayList where active user's tokens will be stored
	 */
	private ArrayList<String> tokens = new ArrayList<String>();
	
	 @Value("${google.api.key}")
	    private String googleApiKey;
	
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
	
	@GetMapping("/bookswap/geocode")
	public ResponseEntity<Object> getCoordinates(@RequestParam("address") String address) {
	    try {
	        // Crea la URL de Google Geocoding API
	        String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" 
	                + address.replace(" ", "+") + "&key=" + googleApiKey;

	        // Realiza la petición HTTP
	        RestTemplate restTemplate = new RestTemplate();
	        String jsonResponse = restTemplate.getForObject(geocodeUrl, String.class);

	        // Parsear el JSON de respuesta
	        GeocodeResponseDTO responseDTO = parseGeocodeResponse(jsonResponse);

	        if (responseDTO != null) {
	            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
	        } else {
	            // Si no encontramos coordenadas, retornamos un error 404
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Coordinates not found.");
	        }
	    } catch (Exception e) {
	        // Si ocurre un error, retornamos un error 500
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing geocoding request.");
	    }
	}
	
	
	@PostMapping("imgini/register")
	public ResponseEntity<Object> register(@RequestBody UserDTO userDTO) {
	    String passwordHash = DigestUtils.sha256Hex(userDTO.getPassword());

	    Optional<User> dbUser = userRepository.findByUser(userDTO.getUsername());
	    if (dbUser.isPresent()) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    } else {
	        // Creamos y guardamos el usuario (Mongo genera automáticamente el ID)
	        User newUser = new User(
	            userDTO.getUsername(),
	            passwordHash,
	            userDTO.getAddress(),
	            userDTO.getProfilePicture(),
	            userDTO.getLat(),
	            userDTO.getLng()
	        );

	        userRepository.save(newUser);

	        String uuid = UUID.randomUUID().toString();
	        String token = uuid.split("-")[0];
	        tokens.add(token);

	        return ResponseEntity.status(HttpStatus.OK).body(token);
	    }
	}

	@GetMapping("bookswap/userInfo")
	public ResponseEntity<Object> userInfo(@RequestParam(value = "token") String userToken,
	                                       @RequestParam(value = "username") String username) {
	    // Validación del token
	    if (!Utilities.checkUser(tokens, userToken)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    // Buscar usuario por nombre
	    Optional<User> user = userRepository.getUserByName(username);
	    if (user.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    // Obtener libros disponibles del usuario
	    List<Book> availableBooks = bookRepository.findByOwnerAndAvailableTrue(username);

	    // Construir objeto UserInfo (adaptado a tu clase)
	    UserInfo userInfo = new UserInfo(
	        user.get().getUsername(),
	        availableBooks,
	        user.get().getAddress()
	    );
	    userInfo.setProfilePicture(user.get().getProfilePicture());

	    return ResponseEntity.status(HttpStatus.OK).body(userInfo);
	}
		
	
	
	@PostMapping("/add_book")
    public ResponseEntity<Object> addBook(@RequestBody BookDTO bookDTO) {
		
        // Buscar el usuario por nombre de usuario (username)
        Optional<User> dbUser = userRepository.findByUsername(bookDTO.getOwner_username());

        // Si el usuario no existe, devolver un error
        if (!dbUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        // Crear el libro
        Book newBook = new Book();
        newBook.setTitle(bookDTO.getTitle());
        newBook.setAuthor(bookDTO.getAuthor());
        newBook.setGenre(bookDTO.getGenre());
        newBook.setDescription(bookDTO.getDescription());
        newBook.setImageUrl(bookDTO.getImageUrl());
        newBook.setOwner_username(bookDTO.getOwner_username());
        newBook.setPublicationDate(java.time.LocalDate.now()); 

        // Guardar el libro en la base de datos
        bookRepository.save(newBook);

        return ResponseEntity.status(HttpStatus.CREATED).body(newBook);
    }
	
	
	@GetMapping("bookswap/book_ownerUsername")
	public ResponseEntity<Object> getBooksByOwnerUsername(
	        @RequestParam(value = "ownerUsername") String ownerUsername,
	        @RequestParam(value = "token") String token) {

	    // Validar el token
	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }

	    // Verificar que el usuario exista
	    Optional<User> ownerUser = userRepository.getUserByName(ownerUsername);
	    if (ownerUser.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    // Obtener los libros asociados al ownerUsername
	    List<Book> books = bookRepository.findByOwnerUsername(ownerUsername);

	    if (books.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Este usuario no tiene libros registrados");
	    }

	    return ResponseEntity.ok(books);
	}

	
}
