import java.util.List;

public class UserInfo {
    private String username;
    private List<Book> availableBooks;
    private String address;
    private String profilePicture;

    // Constructor con parámetros
    public UserInfo( String username, List<Book> availableBooks, String address) {
        this.username = username;
        this.availableBooks = availableBooks;
        this.address = address;
        this.profilePicture = profilePicture;
    }

    // Constructor vacío
    public UserInfo() {
    }

    // Getters y setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Book> getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(List<Book> availableBooks) {
        this.availableBooks = availableBooks;
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
