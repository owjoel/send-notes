package cs302.notes.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.DefaultResponse;
import cs302.notes.data.response.Response;
import cs302.notes.exceptions.InvalidJsonFormatException;
import cs302.notes.service.services.NotesService;
import cs302.notes.service.services.StorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
public class NotesController {

    private final NotesService notesService;
    private final StorageService storageService;

    //Setter Injection
    @Autowired
    public NotesController(NotesService notesService, StorageService storageService) {
        this.notesService = notesService;
        this.storageService = storageService;
    }

    @GetMapping("")
    public ResponseEntity<Response> healthCheck() {
        return new ResponseEntity<>(DefaultResponse.builder().message("Hello World!").build(), HttpStatus.OK);
    }

    @GetMapping("/notes")
    public ResponseEntity<Response> getNotes(@RequestParam(defaultValue = "") String account_num,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int limit) {
        Response response = notesService.getNotes(account_num, page, limit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/notes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> createNotes(@Valid @ModelAttribute NotesRequest request) {
        String s3Url = storageService.uploadFile(request.getFile(), request.getFkAccountOwner());
        request.setUrl(s3Url);
        Response notesResponse = notesService.createNotes(request);
        return new ResponseEntity<>(notesResponse, HttpStatus.CREATED);
    }

    @GetMapping("/notes/{notesId}")
    public ResponseEntity<Response> getNotesById(@PathVariable("notesId") String notesId) {
        Response response = notesService.getNotesById(notesId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/notes/{notesId}")
    public ResponseEntity<Response> replaceNotesById(@PathVariable("notesId") String notesId,
                                                     @Valid @RequestBody NotesRequest request) {
        Response response = notesService.replaceNotes(notesId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/notes/{notesId}")
    public ResponseEntity<Response> deleteNotesById(@PathVariable("notesId") String notesId) {
        Response response = notesService.deleteNotes(notesId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
