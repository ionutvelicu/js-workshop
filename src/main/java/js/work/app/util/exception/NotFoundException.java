package js.work.app.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {
    private static final long serialVersionUID = 3573053772904888690L;

    private NotFoundException(String message) {
        super(message);
    }

    public static NotFoundException instance() {
        return get("");
    }

    public static NotFoundException get(String message) {
        return new NotFoundException(message);
    }
}