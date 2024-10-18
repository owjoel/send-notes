package cs302.notes.repository;

import cs302.notes.models.Notes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotesRepository extends MongoRepository<Notes, String> {
    Optional<Notes> findBy_id(String _id);
    Page findByFkAccountOwnerOrderByStatus(String fkAccountOwner, Pageable pageable);
    Page findByStatusIn(List<String> status, Pageable pageable);
    Page findByStatusInAndCategoryCode(List<String> status, String categoryCode, Pageable pageable);

    @Aggregation(pipeline = {"{$match:{'status' : 'Verified'}}","{$group: {_id: '$categoryCode'}}"})
    List<String> findDistinctCategoryCode();
}
