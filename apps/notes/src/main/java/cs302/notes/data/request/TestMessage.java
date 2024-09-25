package cs302.notes.data.request;

import lombok.Data;

@Data
public class TestMessage {
    private String name;
    
    public TestMessage() {
        this.name = "ash";
    }
}
