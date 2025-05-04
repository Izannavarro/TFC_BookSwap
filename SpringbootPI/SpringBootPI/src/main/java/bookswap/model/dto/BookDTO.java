public class BookDTO {
    private String title;
    private String author;
    private String genre;
    private String description;
    private String image_url;
    private String owner_username;
    private String publication_date;

    public BookDTO() {}

    public BookDTO(String title, String author, String genre, String description, String image_url, String owner_username, String publication_date) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.image_url = image_url;
        this.owner_username = owner_username;
        this.publication_date = publication_date;
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

    public String getOwner_username() {
        return owner_username;
    }

    public void setOwner_username(String owner_id) {
        this.owner_username = owner_username;
    }

    public String getPublication_date() {
        return publication_date;
    }

    public void setPublication_date(String publication_date) {
        this.publication_date = publication_date;
    }
}
