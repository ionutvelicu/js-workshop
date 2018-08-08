package js.work.app.resource;

import js.work.app.data.InMemoryDb;
import js.work.app.domain.Order;
import js.work.app.resource.dto.OrderDetailsDto;
import js.work.app.resource.dto.OrderDto;
import js.work.app.resource.dto.OrderListDto;
import js.work.app.resource.dto.SearchBody;
import js.work.app.service.OrderService;
import js.work.app.util.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 *  GET /api/orders                 getOrders
 *  GET /api/orders/find            findOrders
 *  GET /api/orders/{id}            getOrderDetails
 *  PUT /api/orders/{id}            updateOrder
 *
 *  GET /statuses                   getStatuses
 */

@RestController
@RequestMapping("/api")
public class OrderResource {

    private InMemoryDb db;
    private OrderService orderService;

    @Autowired
    public OrderResource(InMemoryDb db, OrderService orderService) {
        this.db = db;
        this.orderService = orderService;
    }

    @GetMapping(value = "/orders")
    public ResponseEntity<OrderListDto> getOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "5") Integer batch
    ) {
        List<Order> orders = db.orders().subList((page - 1) * batch, page * batch);

        return ResponseEntity.ok(OrderListDto.from(
                orders.stream().map(it -> OrderDto.from(it)).collect(Collectors.toList()),
                page,
                Math.round(Math.ceil(db.orders().size() / batch))
        ));
    }

    @GetMapping(value = "/orders/find")
    public ResponseEntity<OrderListDto> findOrders(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long after,
            @RequestParam(required = false) String createdBy
    ) {
        SearchBody body = SearchBody.from(id, status, after, createdBy);

        List<Order> orders = db.orders()
            .stream()
            .filter(it -> orderService.matches(body, it))
            .collect(Collectors.toList());

        return ResponseEntity.ok(OrderListDto.from(
            orders
                .stream()
                .map(it -> OrderDto.from(it))
                .collect(Collectors.toList()), 1, 1L
        ));
    }

    @GetMapping(value = "/orders/{id}")
    public ResponseEntity<OrderDetailsDto> getOrderDetails(
            @PathVariable String id
    ) {
        List<Order> orders = db.orders()
                .stream()
                .filter(it -> it.id.equals(id))
                .collect(Collectors.toList());

        if (orders.size() == 0) throw NotFoundException.get("Order not found");
        return ResponseEntity.ok(OrderDetailsDto.from(orders.get(0)));
    }

    @PutMapping(value = "/orders/{id}")
    public ResponseEntity<Boolean> updateOrder(
            @PathVariable String id,
            @RequestBody OrderDto dto
    ) {
        List<Order> orders = db.orders()
                .stream()
                .filter(it -> it.id.equals(id))
                .collect(Collectors.toList());

        if (orders.size() == 0) throw NotFoundException.get("Order not found");

        Order order = orders.get(0);
        order.status = dto.status;

        return ResponseEntity.ok(true);
    }

    @GetMapping(value = "/statuses")
    public ResponseEntity<List<String>> getStatuses() {
        return ResponseEntity.ok(Arrays.asList("created", "processing", "pending", "approved", "completed", "rejected", "cancelled"));
    }
}
