package cs302.notes.service.serviceImpl;

import cs302.notes.data.request.NotesRequest;
import cs302.notes.data.response.MultiNotesResponse;
import cs302.notes.data.response.Response;
import cs302.notes.data.response.SingleNotesResponse;
import cs302.notes.exceptions.NotesNotFoundException;
import cs302.notes.models.Notes;
import cs302.notes.repository.NotesRepository;
import cs302.notes.service.services.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        Notes notes = notesRepository.findBy_id(id).orElseThrow(() -> new NotesNotFoundException(id));
        return SingleNotesResponse.builder().response(notes).build();
    }

    @Override
    public Response getNotes(int pageNum, int limit) {
        Pageable paging = PageRequest.of(pageNum, limit);
        Page page = notesRepository.findAll(paging);
        return MultiNotesResponse.builder()
                .totalItems(page.getTotalElements())
                .response(page.getContent())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .build();
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
