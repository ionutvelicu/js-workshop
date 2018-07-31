package js.work.app.service;

import js.work.app.domain.Order;
import js.work.app.resource.dto.SearchBody;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    public boolean matches(SearchBody body, Order order) {
        if (body.id != null && !body.id.equals(order.id)) return false;

        if (body.status != null && !body.status.equals(order.status)) return false;

        if (body.createdBy != null) {
            String[] bits = body.createdBy.split(" ");

            double one = FuzzySearch.ratio(bits[0],order.member.firstName);
            double two = FuzzySearch.ratio(bits[0],order.member.lastName);
            double three = FuzzySearch.ratio(bits[1],order.member.firstName);
            double four = FuzzySearch.ratio(bits[1],order.member.lastName);
            if (one < 80 && two < 80 && three < 80 && four < 80) {
                return false;
            }
        }

        if (body.after != null && order.date < body.after) return false;

        return true;
    }
}
