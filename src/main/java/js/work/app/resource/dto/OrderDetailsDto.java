package js.work.app.resource.dto;

import js.work.app.domain.*;

import java.util.List;

public class OrderDetailsDto {
    public String id;
    public Long date;
    public String website;
    public Double subTotal;
    public Double total;
    public String status;
    public String currency;
    public Member member;
    public List<Item> items;
    public List<Adjustment> adjustments;
    public List<Status> statuses;

    public static OrderDetailsDto from(Order order) {
        OrderDetailsDto dto = new OrderDetailsDto();
        dto.id = order.id;
        dto.date = order.date;
        dto.website = order.website;
        dto.subTotal = order.subTotal;
        dto.total = order.total;
        dto.status = order.status;
        dto.currency = order.currency;
        dto.member = order.member;
        dto.items = order.items;
        dto.adjustments = order.adjustments;
        dto.statuses = order.statuses;
        return dto;
    }

}
