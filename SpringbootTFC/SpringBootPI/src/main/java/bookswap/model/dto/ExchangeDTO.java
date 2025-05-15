package bookswap.model.dto;

public class ExchangeDTO {
	
	private String id;
    private String bookId;
    private String ownerId;
    private String receiverId;
    private String status;  // Este estará en "pending" cuando lo creemos
    private String exchangeDate;

    // Constructor
    public ExchangeDTO(String bookId, String ownerId, String receiverId, String status, String exchangeDate) {
        this.bookId = bookId;
        this.ownerId = ownerId;
        this.receiverId = receiverId;
        this.status = status;
        this.exchangeDate = exchangeDate;
    }
    
    public ExchangeDTO(String id, String ownerId, String status) {
        this.id = id;
        this.ownerId = ownerId;
        this.status = status;
    }
    
    public ExchangeDTO() {}

    // Getters y setters
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

	public String getBookId() {
		return bookId;
	}

	public void setBookId(String bookId) {
		this.bookId = bookId;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public String getReceiverId() {
		return receiverId;
	}

	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}

	public String getExchangeDate() {
		return exchangeDate;
	}

	public void setExchangeDate(String exchangeDate) {
		this.exchangeDate = exchangeDate;
	}
}
