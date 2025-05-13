package bookswap.model.entity;

import java.util.UUID;

public class Message {

    private String message_id;
    private String chatId;
    private String senderId;
    private String receiverId;
    private String content;
    private String timestamp;
    private String status;

    public Message() {}

    public Message(String chatId, String sender_id, String receiver_id, String content, String timestamp, String status) {
        this.message_id = UUID.randomUUID().toString();
        this.chatId = chatId;
        this.senderId = sender_id;
        this.receiverId = receiver_id;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getMessage_id() {
        return message_id;
    }

    public void setMessage_id(String message_id) {
        this.message_id = message_id;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getSender_id() {
        return senderId;
    }

    public void setSender_id(String sender_id) {
        this.senderId = sender_id;
    }

    public String getReceiver_id() {
        return receiverId;
    }

    public void setReceiver_id(String receiver_id) {
        this.receiverId = receiver_id;
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

    @Override
    public String toString() {
        return "Message{" +
                "message_id='" + message_id + '\'' +
                ", chatId='" + chatId + '\'' +
                ", sender_id='" + senderId + '\'' +
                ", receiver_id='" + receiverId + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
