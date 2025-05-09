import bookswap.model.repository.ExchangeRepository;
import bookswap.model.repository.UserRepository;
import bookswap.model.repository.BookRepository;
import bookswap.model.repository.ChatRepository;
import bookswap.model.repository.MessageRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import org.springframework.web.client.RestTemplate;

import bookswap.model.dto.UserDTO;
import bookswap.model.dto.UserPUT;
import bookswap.model.dto.UserInfo;
import bookswap.model.dto.GeocodeResponseDTO;
import bookswap.model.dto.BookDTO;
import bookswap.model.dto.ChatDTO;
import bookswap.model.dto.ExchangeDTO;
import bookswap.model.dto.MessageDTO;
import bookswap.model.dto.MessageInfo;

import bookswap.model.entity.User;
import bookswap.model.entity.Book;
import bookswap.model.entity.Chat;
import bookswap.model.entity.Exchange;
import bookswap.model.entity.Message;
import bookswap.model.entity.GeocodeResponse;
import bookswap.model.entity.GeocodeResult;
import bookswap.model.entity.GeocodeService;
import bookswap.model.Utilities;


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
	 * Repository where the queries that interact with the message collection are
	 * stored
	 */
	@Autowired
	private MessageRepository messageRepository;
	
	
	@Autowired
	private GeocodeService geocodeService;
	
	/**
	 * @param userDTO Object with the new user's username and password
	 * @return HttpStatus NOT_FOUND if the user is not present, or HttpStatus OK if
	 *         user is found and credentials match
	 */
	@PostMapping("bookswap/login")
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
	
	
	@PostMapping("bookswap/register")
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
	            userDTO.getProfilePicture(),
	            userDTO.getAddress(),
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
	
	@GetMapping("bookswap/geocode")
	public ResponseEntity<Object> getCoordinates(@RequestParam("address") String address) {
	    try {
	        // Crea la URL de Google Geocoding API
	        String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" 
	                + address.replace(" ", "+") + "&key=" + googleApiKey;

	        // Realiza la petición HTTP
	        RestTemplate restTemplate = new RestTemplate();
	        String jsonResponse = restTemplate.getForObject(geocodeUrl, String.class);

	        // Parsear el JSON de respuesta
	        GeocodeResponseDTO responseDTO = geocodeService.parseGeocodeResponse(jsonResponse);

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
	
	
	@GetMapping("/bookswap/userLocations")
	public ResponseEntity<Object> getOtherUsersCoordinates(@RequestParam("currentUsername") String currentUsername) {
	    // Obtener todos los usuarios
	    List<User> allUsers = userRepository.findAll();

	    List<UserDTO> userLocations = allUsers.stream()
	    	    .filter(user -> !user.getUsername().equals(currentUsername))
	    	    .map(user -> new UserDTO(
	    	        user.getUsername(),
	    	        user.getLat(),
	    	        user.getLng(),
	    	        user.getAddress()
	    	    ))
	    	    .collect(Collectors.toList());

	    return ResponseEntity.ok(userLocations);
	}

	
	
	@GetMapping("bookswap/userInfo")
	public ResponseEntity<Object> userInfo(@RequestParam(value = "token") String userToken,
	                                       @RequestParam(value = "username") String username) {
	    // Validación del token
	    if (!Utilities.checkUser(tokens, userToken)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    // Buscar usuario por nombre
	    Optional<User> optionalUser = userRepository.getUserByName(username);
	    if (optionalUser.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    User user = optionalUser.get();

	    // Construir el DTO UserInfo
	    UserInfo userInfo = new UserInfo(
	        user.getUsername(),
	        user.getAddress(),
	        user.getProfilePicture()
	    );

	    return ResponseEntity.ok(userInfo);
	}
	
	
	@PostMapping("bookswap/addBook")
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
	
	
	@GetMapping("bookswap/getBooks")
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

	    // Limitar a máximo 5 libros
	    List<Book> limitedBooks = books.stream().limit(5).collect(Collectors.toList());

	    return ResponseEntity.ok(limitedBooks);
	}

	
	@DeleteMapping("bookswap/deleteBook")
	public ResponseEntity<String> deleteBook(@RequestBody Map<String, String> requestData) {
	    String title = requestData.get("title");
	    String ownerUsername = requestData.get("owner_username");

	    if (title == null || ownerUsername == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title and owner_username are required.");
	    }

	    // Buscar el libro en la base de datos
	    Optional<Book> bookToDelete = bookRepository.findByTitleAndOwnerUsername(title, ownerUsername);

	    if (bookToDelete.isPresent()) {
	        bookRepository.delete(bookToDelete.get());
	        return ResponseEntity.ok("Book deleted successfully.");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found.");
	    }
	}
	
	@GetMapping("bookswap/getUsersInfo")
	public ResponseEntity<Object> getUsers(@RequestParam("token") String token) {
	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }

	    List<User> allUsers = userRepository.findAll();

	    List<UserDTO> usersDto = allUsers.stream()
	        .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getProfilePicture()))
	        .collect(Collectors.toList());
	    
	    // Retornar la lista de usuarios DTO
	    return ResponseEntity.ok(usersDto);
	}

	
	@GetMapping("bookswap/getMyExchanges")
	public ResponseEntity<Object> getMyExchanges(
	        @RequestParam("ownerUsername") String ownerUsername,
	        @RequestParam("token") String token) {

	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }

	    Optional<User> user = userRepository.getUserByName(ownerUsername);
	    if (user.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    List<Exchange> exchanges = exchangeRepository.findByOwnerId(user.get().getId());

	    return ResponseEntity.ok(exchanges);
	}

	
	@PostMapping("bookswap/addExchange")
	public ResponseEntity<Object> addExchange(
	        @RequestBody Map<String, String> payload,
	        @RequestParam("token") String token) {

	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }

	    String bookTitle = payload.get("bookTitle");
	    String ownerName = payload.get("ownerName");
	    String receiverName = payload.get("receiverName");

	    Optional<User> owner = userRepository.getUserByName(ownerName);
	    Optional<User> receiver = userRepository.getUserByName(receiverName);
	    Optional<Book> book = bookRepository.getBookByTitle(bookTitle);

	    if (owner.isEmpty() || receiver.isEmpty() || book.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos o incompletos");
	    }

	    Exchange exchange = new Exchange();
	    exchange.setBookId(book.get().getId());
	    exchange.setOwnerId(owner.get().getId());
	    exchange.setReceiverId(receiver.get().getId());
	    exchange.setStatus("pending");
	    exchange.setExchangeDate(LocalDateTime.now());

	    exchangeRepository.save(exchange);

	    return ResponseEntity.ok(exchange);
	}


	@GetMapping("bookswap/getReceivedExchanges")
	public ResponseEntity<Object> getReceivedExchanges(
	        @RequestParam("receiverUsername") String receiverUsername,
	        @RequestParam("token") String token) {

	    // Validar el token
	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }

	    Optional<User> receiver = userRepository.getUserByName(receiverUsername);
	    if (receiver.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    // Obtener los intercambios donde el receiver_id sea el id del usuario y el status sea "pending"
	    List<Exchange> exchanges = exchangeRepository.findByReceiverIdAndStatus(receiver.get().getId(), "pending");

	    return ResponseEntity.ok(exchanges);
	}
	
	@PutMapping("bookswap/updateExchangeStatus")
	public ResponseEntity<?> updateExchangeStatus(@RequestBody ExchangeDTO dto) {
	    Optional<Exchange> optionalExchange = exchangeRepository.findById(dto.getId);

	    if (!optionalExchange.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exchange not found");
	    }

	    Exchange exchange = optionalExchange.get();
	    exchange.setStatus(dto.getStatus());
	    exchangeRepository.save(exchange);

	    return ResponseEntity.ok("Exchange status updated successfully");
	}
	
	
	@GetMapping("bookswap/getChats")
	public ResponseEntity<Object> getUserChats(@RequestParam("username") String username
			, @RequestParam("token") String token) {
		
		// Validar el token
	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }
		
	    List<Chat> chats = chatRepository.findByParticipantsContaining(username);

	    List<Map<String, Object>> chatList = chats.stream().map(chat -> {
	        Map<String, Object> result = new HashMap<>();
	        result.put("_id", chat.getId());
	        result.put("participants", chat.getParticipants());	
	        return result;
	    }).collect(Collectors.toList());

	    return ResponseEntity.ok(chatList);
	}


	@GetMapping("/bookswap/getMessages")
	public ResponseEntity<List<MessageInfo>> getMessages(
	        @RequestParam String chatId, 
	        @RequestParam("token") String token) {

	    // Validar el token
	    if (!Utilities.checkUser(tokens, token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
	    }
	    
	    List<Message> messages = messageRepository.findByChatIdOrderByTimestampAsc(chatId);

	    List<MessageInfo> messageInfos = messages.stream()
	        .map(msg -> new MessageInfo(
	            msg.getSender_id(),
	            msg.getContent(),
	            msg.getTimestamp(),
	            msg.getStatus()
	        ))
	        .collect(Collectors.toList());

	    return ResponseEntity.ok(messageInfos);
	}

	
	@PostMapping("/bookswap/addMessage")
	public ResponseEntity<String> addMessage(@RequestBody MessageDTO messageDTO) {
	    Message message = new Message();
	    message.setMessage_id(UUID.randomUUID().toString());
	    message.setSender_id(messageDTO.getSenderId());
	    message.setReceiver_id(messageDTO.getReceiverId());
	    message.setContent(messageDTO.getContent());
	    message.setTimestamp(LocalDateTime.now().toString());
	    message.setStatus("delivered");
	    message.setChatId(messageDTO.getChatId());

	    messageRepository.save(message);
	    return ResponseEntity.ok("Message added");
	}

	
	@PostMapping("/bookswap/markMessagesViewed")
	public ResponseEntity<String> markMessagesAsViewed(@RequestBody Map<String, String> body) {
	    String chatId = body.get("chatId");
	    String receiverId = body.get("receiverId");

	    List<Message> messages = messageRepository.findByChatIdAndReceiverIdAndStatus(chatId, receiverId, "delivered");
	    for (Message msg : messages) {
	        msg.setStatus("viewed");
	    }
	    messageRepository.saveAll(messages);
	    return ResponseEntity.ok("Messages marked as viewed");
	}

	
	
	@PutMapping("bookswap/updateUser")
	public ResponseEntity<String> updateUser(@RequestParam(value = "token") String userToken,
			@RequestBody UserPUT updatedUser) {
		if (!Utilities.checkUser(tokens, userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> userOptional = userRepository.getUserByName(updatedUser.getOldName());
		if (userOptional.isPresent()) {
			String passwordHash = DigestUtils.sha256Hex(updatedUser.getPassword());
			User user = userOptional.get();
			user.setUsername(updatedUser.getNewName());
			user.setPassword(passwordHash);
			user.setProfilePicture(updatedUser.getProfilePicture());

			userRepository.save(user);
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
	
	
	/**
	 * @param userToken Token that will authenticate the user
	 * @return Nothing, HTTPStatus NO_CONTENT if successfully logged out, or
	 *         HTTPStatus NOT_FOUND if couldn't find user
	 */
	@GetMapping("bookswap/logout")
	public ResponseEntity<Object> logout(@RequestParam(value = "token") String userToken) {
		try {
			tokens.remove(Utilities.findToken(tokens, userToken));
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} catch (Exception ex) {
			ex.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
	
	
	/**
	 * @param name      String Name of the user to be deleted
	 * @param password  String Password of the user to be deleted
	 * @param userToken Token that will authenticate the user
	 * @return HttpStatus NOT_FOUND if the user couldn't be found, or HttpStatus
	 *         NO_CONTENT if user and their attempts have been deleted successfully
	 */
	@DeleteMapping("bookswap/deleteAccount")
	public ResponseEntity<String> deleteAccount(@RequestParam(value = "name") String name,
			@RequestParam(value = "password") String password, @RequestParam(value = "token") String userToken) {
		if (!Utilities.checkUser(tokens, userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		String passwordHash = DigestUtils.sha256Hex(password);
		Optional<User> user = userRepository.findByUserAndPassword(name, passwordHash);
		if (user.isPresent()) {
			userRepository.delete(user.get());
			tokens.remove(Utilities.findToken(tokens, userToken));
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
	
}
