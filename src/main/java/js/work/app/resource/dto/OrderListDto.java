package js.work.app.resource.dto;

import java.util.List;

public class OrderListDto {
    public List<OrderDto> orders;
    public Integer currentPage;
    public Long pageCount;

    public static OrderListDto from(List<OrderDto> orders, Integer current, Long count) {
        OrderListDto dto = new OrderListDto();

        dto.orders = orders;
        dto.pageCount = count;
        dto.currentPage = current;

        return dto;
    }
}
