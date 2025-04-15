import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Chat")
public class Chat {

    @Id
    private String id;
    private List<String> participants;
    private List<Message> messages;

    public Chat() {}

    public Chat(List<String> participants, String created_at, List<Message> messages) {
        this.participants = participants;
        this.messages = messages;
    }

    public String get_id() {
        return id;
    }

    public void set_id(String _id) {
        this.id = _id;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
    
    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "_id='" + id + '\'' +
                ", participants=" + participants +
                ", created_at='" + created_at + '\'' +
                ", messages=" + messages +
                '}';
    }
}
