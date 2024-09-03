package cs302.notes.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class NotesNotFoundException extends NotFoundException{
    private static final long serialVersionUID = 1L;

    public NotesNotFoundException(String notesId) {
        super(String.format("Notes with id %s not found", notesId));
    }
}
