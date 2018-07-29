package js.work.app.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Component
public class ResourceUtils {
    private static final Logger log = LoggerFactory.getLogger(ResourceUtils.class);

    public String getContents(String path) throws IOException {
        File file = new ClassPathResource(path).getFile();
        return new String(Files.readAllBytes(file.toPath()));
    }

}
