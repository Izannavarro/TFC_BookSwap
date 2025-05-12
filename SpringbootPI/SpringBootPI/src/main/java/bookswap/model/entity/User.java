package bookswap.model.entity;

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
    
    public User() {}

    public User(String name, String pwd, String profilePic, String address, double lat, double lng) {
        this.username = name;
        this.password = pwd;
        this.profilePicture = profilePic;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
    }
    
 // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String _id) {
        this.id = _id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getProfilePicture() {
    	return profilePicture;
    }
    
    public void setProfilePicture(String base64) {
    	this.profilePicture = base64;
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
}
