import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
public class User {
	
	@Id
    private String id;  // De vuelta a String para que Mongo genere el ObjectId automáticamente
    private String username;
    private String password;
    private String profilePicture;
    private String address;
    private double lat;
    private double lng;
    private List<String> available_books = new ArrayList<>();
    
    public User() {}

    public User(String name, String pwd, String profilePic, String address, double lat, double lng) {
        this.username = name;
        this.password = pwd;
        this.profilePicture = profilePic;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.available_books = available_books;
    }
    
 // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String _id) {
        this.id = _id;
    }

    public String getName() {
        return username;
    }

    public void setName(String name) {
        this.username = name;
    }
    
    public void getProfilePicture() {
    	return profilePicture;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public String[] getAvailableBooks() {
        return available_books;
    }

    public void setAvailableBooks(String[] available_books) {
        this.available_books = available_books;
    }
}
