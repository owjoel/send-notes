package cs302.notes.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderCreated {
    private String _id;
    private String stripeTransactionId;
    private String noteId;
    private String buyerId;
    private String orderStatus;
    private Integer orderPrice;
}


