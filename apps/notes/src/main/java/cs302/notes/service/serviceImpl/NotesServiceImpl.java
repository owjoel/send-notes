package cs302.notes.service.serviceImpl;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.Response;
import cs302.notes.service.services.NotesService;
import org.springframework.stereotype.Service;

@Service
public class NotesServiceImpl implements NotesService {

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
        return null;
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
