package cs302.notes.data.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MultiStringResponse {
    public List<String> response;
}
