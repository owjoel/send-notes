package cs302.notes.repository;

import cs302.notes.models.Notes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotesRepository extends MongoRepository<Notes, String> {
    Optional<Notes> findBy_id(String _id);
    Page findByFkAccountOwner(String fkAccountOwner, Pageable pageable);
    List<String> findDistinctCourseCodeBy();
}
