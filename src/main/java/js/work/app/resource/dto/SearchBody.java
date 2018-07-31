package js.work.app.resource.dto;

public class SearchBody {
    public String id;
    public String status;
    public Long after;
    public String createdBy;

    public static SearchBody from(String id, String status, Long after, String createdBy) {
        SearchBody body = new SearchBody();
        body.id = id;
        body.status = status;
        body.after = after;
        body.createdBy = createdBy;
        return body;
    }
}
