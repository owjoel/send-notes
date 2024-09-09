package cs302.notes.models;

import cs302.notes.data.request.NotesRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Notes {

    //_id stores the notes' autogenerated id
    private String _id;

    //fkAccountOwner stores the AWS cognito user id
    private String fkAccountOwner;

    //title stores the notes title to be displayed
    private String title;

    //description stores the string data describing the notes
    private String description;

    //url stores the S3 bucket's URL
    private String url;

    //categoryCode stores the module number of the notes
    private String categoryCode;

    //price stores the notes' price in cents
    private Integer price;

    public Notes(NotesRequest request) {
        this.fkAccountOwner = request.getFkAccountOwner();
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.url = request.getUrl();
        this.categoryCode = request.getCategoryCode();
        this.price = request.getPrice();
    }
}
