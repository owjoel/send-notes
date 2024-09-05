package cs302.notes.repository;

import cs302.notes.models.Notes;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NotesRepository extends MongoRepository<Notes, String> {
    Optional<Notes> findBy_id(String _id);
}
