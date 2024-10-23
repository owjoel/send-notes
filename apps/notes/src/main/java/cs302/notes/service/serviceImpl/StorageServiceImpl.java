package cs302.notes.service.serviceImpl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import cs302.notes.exceptions.FileNotConvertedException;
import cs302.notes.exceptions.InvalidFileTypeException;
import cs302.notes.service.services.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageServiceImpl implements StorageService {

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    private final AmazonS3 s3Client;

    private final List<String> ACCEPTED_FILE_EXTENSIONS = Arrays.asList(".pdf",".jpg",".jpeg",".txt",".doc",".docx",".ppt",".pptx");

    public String uploadFile(MultipartFile file, String fkAccountOwner) {
        // Validate File extension
        String fileExtension = getFileExtension(file);
        if (!ACCEPTED_FILE_EXTENSIONS.contains(fileExtension)) {
            throw new InvalidFileTypeException(fileExtension);
        }

        // Convert file and store in S3 bucket
        File fileObj = convertMultiPartFileToFile(file);
        String fileName = fkAccountOwner + "_" + System.currentTimeMillis() + "_" + secureFileName(file.getOriginalFilename());
        s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
        fileObj.delete();
        return s3Client.getUrl(bucketName, fileName).toString();
    }

    // Removes all spaces in the string to
    private String secureFileName(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf("."));
        String fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));
        String secureFileName = fileNameWithoutExtension.replace(" ", "").replaceAll("[^a-zA-Z0-9]+","") + extension;
        System.out.println(secureFileName);
        return secureFileName;
    }
    
    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(secureFileName(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            throw new FileNotConvertedException(file.getOriginalFilename());
        }
        return convertedFile;
    }

    private String getFileExtension(MultipartFile file) {
        String extension;
        try {
            extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        } catch (Exception e) {
            extension = "";
        }
        return extension;
    }
}
