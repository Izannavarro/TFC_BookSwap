
public class MessageInfo {
    private String senderId;
    private String content;
    private String timestamp;
    
    public MessageInfo(String senderId, String content, String timestamp) {
    	this.senderId = senderId;
    	this.content = content;
    	this.timestamp = timestamp;
    }
    
    public MessageInfo() {
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
}
