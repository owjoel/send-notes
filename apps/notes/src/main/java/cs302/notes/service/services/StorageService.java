package cs302.notes.service.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface StorageService {
    String uploadFile(MultipartFile file, String fkAccountOwner);
}
