package cs302.notes.data.response;

import cs302.notes.models.Notes;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MultiNotesResponse implements Response {
    public long totalItems;
    public List<Notes> response;
    public long totalPages;
    public long currentPage;
}
