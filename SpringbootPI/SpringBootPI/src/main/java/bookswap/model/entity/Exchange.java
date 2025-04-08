import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Exchange")
public class Exchange {
	
	@Id
    private String _id;
    private String book_id;
    private String owner_id;
    private String receiver_id;
    private String status;
    private String exchange_date;

    // Constructor vacío
    public Exchange() {}

    // Constructor completo
    public Exchange(String book_id, String owner_id, String receiver_id, String status, String exchange_date) {
        this.book_id = book_id;
        this.owner_id = owner_id;
        this.receiver_id = receiver_id;
        this.status = status;
        this.exchange_date = exchange_date;
    }

    // Getters y setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getBook_id() {
        return book_id;
    }

    public void setBook_id(String book_id) {
        this.book_id = book_id;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }

    public String getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(String receiver_id) {
        this.receiver_id = receiver_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExchange_date() {
        return exchange_date;
    }

    public void setExchange_date(String exchange_date) {
        this.exchange_date = exchange_date;
    }

    // Método toString para depuración rápida
    @Override
    public String toString() {
        return "Exchange{" +
                "_id='" + _id + '\'' +
                ", book_id='" + book_id + '\'' +
                ", owner_id='" + owner_id + '\'' +
                ", receiver_id='" + receiver_id + '\'' +
                ", status='" + status + '\'' +
                ", exchange_date='" + exchange_date + '\'' +
                '}';
    }
}
