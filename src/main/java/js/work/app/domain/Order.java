package js.work.app.domain;

import java.util.List;

public class Order {
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
}
