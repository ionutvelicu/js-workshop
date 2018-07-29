package js.work.app.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProps {
    @Value("${app.json.path}")
    public String jsonPath;
}
