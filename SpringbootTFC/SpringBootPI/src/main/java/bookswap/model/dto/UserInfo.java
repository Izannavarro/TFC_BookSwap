package bookswap.model.dto;

public class UserInfo {
	private String id;
    private String username;
    private String address;
    private String profilePicture;
    private double lat;
    private double lng;

    // Constructor con parámetros
    public UserInfo(String id, String username, String address, String profilePicture, double d, double e) {
    	this.id = id;
        this.username = username;
        this.address = address;
        this.profilePicture = profilePicture;
        this.lat = d;
        this.lng = e;
    }

    // Constructor vacío
    public UserInfo() {
    	
    }

    // Getters y setters
    

    public double getLat() {
		return lat;
	}

	public void setLat(long lat) {
		this.lat = lat;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(long lng) {
		this.lng = lng;
	}
	
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
