package cs302.notes.controller;

import cs302.notes.data.response.DefaultResponse;
import cs302.notes.data.response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class NotesController {
    @GetMapping(name = "/")
    public ResponseEntity<Response> healthCheck() {
        DefaultResponse defaultResponse = DefaultResponse.builder().message("Hello World!").build();
        return new ResponseEntity(defaultResponse, HttpStatus.OK);
    }
}
