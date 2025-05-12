package bookswap.model.dto;

public class UserDTO {
	
	private String id;
    private String username;
    private String password;
    private String address;
    private String profilePicture;
    private double lat;
    private double lng;

    public UserDTO(String username, String password, String profilePicture, String address, double lat, double lng) {
        this.username = username;
        this.password = password;
        this.profilePicture = profilePicture;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
    }
    
    public UserDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    public UserDTO(String id, String username, String profilePicture) {
        this.id = id;
        this.username = username;
        this.profilePicture = profilePicture;
    }
    
    public UserDTO(String username, double lat, double lng, String address) {
        this.username = username;
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }
    
    public UserDTO() {}
    
    // Getters y setters para los nuevos campos
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
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
