package bookswap.model.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import bookswap.model.dto.GeocodeResponseDTO;

import org.springframework.stereotype.Service;

@Service
public class GeocodeService {

    public GeocodeResponseDTO parseGeocodeResponse(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonResponse);

            if ("OK".equals(root.path("status").asText())) {
                JsonNode results = root.path("results");
                if (results.isArray() && results.size() > 0) {
                    JsonNode location = results.get(0).path("geometry").path("location");
                    double lat = location.path("lat").asDouble();
                    double lng = location.path("lng").asDouble();

                    return new GeocodeResponseDTO(lat, lng);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); 
        }

        return null;
    }
}
