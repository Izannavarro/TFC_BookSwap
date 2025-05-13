package bookswap.model.dto;

public class MessageInfo {
	
	private String messageId;
    private String senderId;
    private String content;
    private String timestamp;
    private String status;

    public MessageInfo() {}

    public MessageInfo(String messageId, String senderId, String content, String timestamp, String status) {
    	this.messageId = messageId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}
}
