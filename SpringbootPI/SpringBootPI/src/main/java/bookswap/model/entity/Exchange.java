package bookswap.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Exchange")
public class Exchange {
	
	@Id
    private String id;
    private String bookId;
    private String ownerId;
    private String receiverId;
    private String status;
    private String exchangeDate;

    // Constructor vacío
    public Exchange() {}

    // Constructor completo
    public Exchange(String book_id, String owner_id, String receiver_id, String status, String exchange_date) {
        this.bookId = book_id;
        this.ownerId = owner_id;
        this.receiverId = receiver_id;
        this.status = status;
        this.exchangeDate = exchange_date;
    }

    // Getters y setters
    public String get_id() {
        return id;
    }

    public void set_id(String _id) {
        this.id = _id;
    }

    public String getBook_id() {
        return bookId;
    }

    public void setBook_id(String book_id) {
        this.bookId = book_id;
    }

    public String getOwner_id() {
        return ownerId;
    }

    public void setOwner_id(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getReceiver_id() {
        return receiverId;
    }

    public void setReceiver_id(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExchange_date() {
        return exchangeDate;
    }

    public void setExchange_date(String exchangeDate) {
        this.exchangeDate = exchangeDate;
    }

    // Método toString para depuración rápida
    @Override
    public String toString() {
        return "Exchange{" +
                "_id='" + id + '\'' +
                ", book_id='" + bookId + '\'' +
                ", owner_id='" + ownerId + '\'' +
                ", receiver_id='" + receiverId + '\'' +
                ", status='" + status + '\'' +
                ", exchange_date='" + exchangeDate + '\'' +
                '}';
    }
}
