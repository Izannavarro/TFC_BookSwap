public class UserDTO {
    private String username;
    private String password;
    private String address;
    private String profilePicture;
    private double lat;
    private double lng;

    public UserDTO(String username, String password, String address, String profilePicture, double lat, double lng) {
        this.username = username;
        this.password = password;
        this.address = address;
        this.profilePicture = profilePicture;
        this.lat = lat;
        this.lng = lng;
    }

    // Getters y setters para los nuevos campos
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
