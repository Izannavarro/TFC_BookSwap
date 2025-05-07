import java.util.List;

public class GeocodeResponse {
    private List<GeocodeResult> results;

    public List<GeocodeResult> getResults() {
        return results;
    }

    public void setResults(List<GeocodeResult> results) {
        this.results = results;
    }
}