import java.util.List;

public class UserInfo {
    private String id;
    private String username;
    private List<Book> availableBooks;
    private String address;
    private String registrationDate;

    // Constructor con parámetros
    public UserInfo(String id, String username, List<Book> availableBooks, String address, String registrationDate) {
        this.id = id;
        this.username = username;
        this.availableBooks = availableBooks;
        this.address = address;
        this.registrationDate = registrationDate;
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

    public String getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(String registrationDate) {
        this.registrationDate = registrationDate;
    }
}
