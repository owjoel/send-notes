package cs302.notes.service.serviceImpl;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.Response;
import cs302.notes.data.response.SingleNotesResponse;
import cs302.notes.models.Notes;
import cs302.notes.repository.NotesRepository;
import cs302.notes.service.services.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotesServiceImpl implements NotesService {

    private final NotesRepository notesRepository;

    //Setter Injection
    @Autowired
    public NotesServiceImpl(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }

    @Override
    public Response getNotesById(String id) {
        return null;
    }

    @Override
    public Response getNotes(int pageNo, int limit) {
        return null;
    }

    @Override
    public Response createNotes(NotesRequest request) {
        Notes notes = notesRepository.insert(new Notes(request));
        return SingleNotesResponse.builder().response(notes).build();
    }

    @Override
    public Response modifyNotes(String id, NotesRequest request) {
        return null;
    }

    @Override
    public Response deleteNotes(String id) {
        return null;
    }
}
