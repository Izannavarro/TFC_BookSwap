package bookswap.model.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import bookswap.model.dto.*;

@Service
public class GeocodeService {

    public GeocodeResponseDTO parseGeocodeResponse(String jsonResponse) {
        try {
            // Crear un ObjectMapper de Jackson
            ObjectMapper objectMapper = new ObjectMapper();

            // Deserializar el JSON de la respuesta de la API de Google Geocoding
            GeocodeResponse geocodeResponse = objectMapper.readValue(jsonResponse, GeocodeResponse.class);

            // Verificar si hay resultados
            if (geocodeResponse != null && geocodeResponse.getResults() != null && !geocodeResponse.getResults().isEmpty()) {
                // Obtener la primera ubicación
                GeocodeResult result = geocodeResponse.getResults().get(0);

                // Obtener las coordenadas de la ubicación
                GeocodeResult.Geometry geometry = result.getGeometry();
                GeocodeResult.Location location = geometry.getLocation();

                double lat = location.getLat();
                double lng = location.getLng();

                // Devolver las coordenadas en el DTO
                return new GeocodeResponseDTO(lat, lng);
            } else {
                // Si no hay resultados, retornar null
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Si ocurre un error, retornar null
            return null;
        }
    }
}
