package cs302.notes.data.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DefaultResponse implements Response {
    private String message;
}
