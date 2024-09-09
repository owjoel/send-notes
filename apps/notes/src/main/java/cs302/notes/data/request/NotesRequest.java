package cs302.notes.data.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
public class NotesRequest {
    @NotEmpty @Size(min=1)
    //fkAccountOwner stores the AWS cognito user id
    private String fkAccountOwner;

    @NotEmpty @Size(min=1, max=50)
    //title stores the notes title to be displayed
    private String title;

    @NotEmpty @Size(min=1, max=300)
    //description stores the string data describing the notes
    private String description;

    @URL
    //url stores the S3 bucket's URL
    private String url;

    @NotEmpty @Size(min=1, max=50)
    //categoryCode stores the module number of the notes
    private String categoryCode;

    @Min(1)
    //price stores the notes' price in cents
    private Integer price;
}
