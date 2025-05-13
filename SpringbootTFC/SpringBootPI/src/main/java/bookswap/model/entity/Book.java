package bookswap.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Book")
public class Book {
	
	@Id
	private String id;
	private String title;
    private String author;
    private String genre;
    private String description;
    private String image_url;
    private String ownerUsername;
    private String publicationDate;

    // Constructor vacío
    public Book() {}

    // Constructor completo
    public Book(String title, String author, String genre, String description, String image_url, String owner_username, String publication_date) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.image_url = image_url;
        this.ownerUsername = owner_username;
        this.publicationDate = publication_date;
    }

    // Getters y setters
    public String get_id() {
        return id;
    }

    public void set_id(String _id) {
        this.id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String owner_username) {
        this.ownerUsername = owner_username;
    }

    public String getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(String localDate) {
        this.publicationDate = localDate;
    }

    // Método toString para depuración rápida
    @Override
    public String toString() {
        return "Book{" +
                "_id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", genre='" + genre + '\'' +
                ", description='" + description + '\'' +
                ", image_url='" + image_url + '\'' +
                ", owner_username='" + ownerUsername + '\'' +
                ", publication_date='" + publicationDate + '\'' +
                '}';
    }
}
