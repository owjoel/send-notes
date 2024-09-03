package cs302.notes.controller;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.DefaultResponse;
import cs302.notes.data.response.Response;
import cs302.notes.service.services.NotesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class NotesController {

    private final NotesService notesService;

    //Setter Injection
    @Autowired
    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    @GetMapping("")
    public ResponseEntity<Response> healthCheck() {
        return new ResponseEntity<>(DefaultResponse.builder().message("Hello World!").build(), HttpStatus.OK);
    }

    @GetMapping("/notes")
    public ResponseEntity<Response> getNotes(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int limit) {
        Response response = notesService.getNotes(page, limit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/notes")
    public ResponseEntity<Response> createNotes(@Valid @RequestBody NotesRequest request) {
        Response response = notesService.createNotes(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/notes/{notesId}")
    public ResponseEntity<Response> getNotesById(@PathVariable("notesId") String notesId) {
        Response response = notesService.getNotesById(notesId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
