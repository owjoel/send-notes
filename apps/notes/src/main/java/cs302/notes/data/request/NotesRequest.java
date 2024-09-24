package cs302.notes.data.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class NotesRequest {

    @JsonProperty("fkAccountOwner")
    @NotEmpty @Size(min=1)
    //fkAccountOwner stores the AWS cognito user id
    private String fkAccountOwner;

    @JsonProperty("title")
    @NotEmpty @Size(min=1, max=50)
    //title stores the notes title to be displayed
    private String title;

    @JsonProperty("description")
    @NotEmpty @Size(min=1, max=300)
    //description stores the string data describing the notes
    private String description;

    @URL
    //url stores the S3 bucket's URL
    private String url;

    private MultipartFile file;

    @JsonProperty("categoryCode")
    @NotEmpty @Size(min=1, max=50)
    //categoryCode stores the module number of the notes
    private String categoryCode;

    @JsonProperty("price")
    @Min(1)
    //price stores the notes' price in cents
    private Integer price;
}
