package cs302.notes.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Error
public class InvalidJsonFormatException extends BadRequestException{
    private static final long serialVersionUID = 1L;

    public InvalidJsonFormatException() {
        super(String.format("Data is not in JSON format"));
    }
}
