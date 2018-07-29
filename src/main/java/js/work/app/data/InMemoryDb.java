package js.work.app.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import js.work.app.domain.Order;
import js.work.app.util.AppProps;
import js.work.app.util.ResourceUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class InMemoryDb {
    private static final Logger log = LoggerFactory.getLogger(InMemoryDb.class);
    private List<Order> orders;

    private ResourceUtils resourceUtils;
    private AppProps appProps;
    private ObjectMapper objectMapper;

    @Autowired
    private InMemoryDb(ResourceUtils resourceUtils, AppProps appProps, ObjectMapper objectMapper) {
        this.resourceUtils = resourceUtils;
        this.appProps = appProps;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    private void init() {
        log.info("=> fetching orders");
        try {
            String content = resourceUtils.getContents(appProps.jsonPath);
            orders = objectMapper.readValue(content, new TypeReference<List<Order>>(){});
            log.info(String.format("=> fetched %d orders", orders.size()));
        } catch (Exception ex) {
            log.error("=> Failed to fetch orders", ex);
        }
    }

    public List<Order> orders() {
        return orders;
    }
}
