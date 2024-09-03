package cs302.notes.service.services;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.Response;
import org.springframework.stereotype.Service;

@Service
public interface NotesService {
    Response getNotesById(String id);
    Response getNotes(int pageNo, int limit);
    Response createNotes(NotesRequest request);
    Response modifyNotes(String id, NotesRequest request);
    Response deleteNotes(String id);
}
