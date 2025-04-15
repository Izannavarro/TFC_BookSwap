public class ChatDTO {
    private String participant1Id;
    private String participant2Id;

    public ChatDTO() {}

    public ChatDTO(String participant1Id, String participant2Id) {
        this.participant1Id = participant1Id;
        this.participant2Id = participant2Id;
    }

    public String getParticipant1Id() {
        return participant1Id;
    }

    public void setParticipant1Id(String participant1Id) {
        this.participant1Id = participant1Id;
    }

    public String getParticipant2Id() {
        return participant2Id;
    }

    public void setParticipant2Id(String participant2Id) {
        this.participant2Id = participant2Id;
    }
}
