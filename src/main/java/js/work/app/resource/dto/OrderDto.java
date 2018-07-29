package js.work.app.resource.dto;

import js.work.app.domain.Order;

public class OrderDto {
    public String id;
    public Long date;
    public String website;
    public Double subTotal;
    public Double total;
    public String status;
    public String currency;

    public static OrderDto from(Order order) {
        OrderDto dto = new OrderDto();
        dto.id = order.id;
        dto.date = order.date;
        dto.website = order.website;
        dto.subTotal = order.subTotal;
        dto.total = order.total;
        dto.status = order.status;
        dto.currency = order.currency;
        return dto;
    }

}
