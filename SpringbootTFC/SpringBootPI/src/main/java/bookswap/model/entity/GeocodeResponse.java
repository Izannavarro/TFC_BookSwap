package bookswap.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GeocodeResponse {

    @JsonProperty("results")
    private List<GeocodeResult> results;

    @JsonProperty("status")
    private String status;

    public List<GeocodeResult> getResults() {
        return results;
    }

    public void setResults(List<GeocodeResult> results) {
        this.results = results;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
