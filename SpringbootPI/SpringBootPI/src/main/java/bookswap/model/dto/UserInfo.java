package bookswap.model.dto;

public class UserInfo {
	private String id;
    private String username;
    private String address;
    private String profilePicture;

    // Constructor con parámetros
    public UserInfo(String id, String username, String address, String profilePicture) {
    	this.id = id;
        this.username = username;
        this.address = address;
        this.profilePicture = profilePicture;
    }

    // Constructor vacío
    public UserInfo() {
    	
    }

    // Getters y setters
    
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
}
