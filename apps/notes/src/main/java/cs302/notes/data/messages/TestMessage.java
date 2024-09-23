package cs302.notes.data.messages;

import lombok.Data;

@Data
public class TestMessage {
    private String name;
    
    public TestMessage() {
        this.name = "ash";
    }
}
