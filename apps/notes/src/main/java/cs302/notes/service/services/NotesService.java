package cs302.notes.service.services;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.Response;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotesService {
    Response getNotesById(String id);
    Response getAllNotesByAccountId(String account_num, int pageNum, int limit);
    Response getAllNotesByStatusIn(List<String> status, int pageNum, int limit);
    Response getAllNotesByCategoryCodeAndStatusIn(String categoryCode, List<String> status, int pageNum, int limit);
    Response getAllDistinctCategories();
    Response createNotes(NotesRequest request);
    Response replaceNotes(String id, NotesRequest request);
    Response deleteNotes(String id);
}
