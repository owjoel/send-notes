package cs302.notes.controller;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.DefaultResponse;
import cs302.notes.data.response.Response;
import cs302.notes.service.services.NotesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class NotesController {

    private final NotesService notesService;
    private static final Logger logger = LoggerFactory.getLogger(NotesController.class);


    //Setter Injection
    @Autowired
    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    @GetMapping("")
    public ResponseEntity<Response> healthCheck() {
        return new ResponseEntity<>(DefaultResponse.builder().message("Hello World!").build(), HttpStatus.OK);
    }

    @GetMapping("/notes/categories")
    public ResponseEntity<Response> getAllDistinctCategories() {
        Response response = notesService.getAllDistinctCategories();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/notes/account")
    public ResponseEntity<Response> getAllNotesByAccount(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int limit,
                                                         @RequestAttribute("id") String id) {
        Response response = notesService.getAllNotesByAccountId(id, page, limit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/notes")
    public ResponseEntity<Response> getAllVerifiedNotes(@RequestParam(defaultValue = "") String categoryCode,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int limit) {
        Response response = "".equals(categoryCode) ? notesService.getAllNotesByStatusIn(List.of("Verified"), page, limit)
                : notesService.getAllNotesByCategoryCodeAndStatusIn(categoryCode, List.of("Verified"), page, limit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/notes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> createNotes(@Valid @ModelAttribute NotesRequest request,
                                                @RequestAttribute("id") String id) {
        request.setFkAccountOwner(id);
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
                                                     @Valid @RequestBody NotesRequest request,
                                                     @RequestAttribute("id") String id) {
        Response response = notesService.replaceNotes(id, notesId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/notes/{notesId}")
    public ResponseEntity<Response> deleteNotesById(@PathVariable("notesId") String notesId,
                                                    @RequestAttribute("id") String id) {
        Response response = notesService.deleteNotes(id, notesId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
