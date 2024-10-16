package cs302.notes.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /*
     * Setting up of Cross-Origin Resource Sharing
     *
     * Defines a CORS filter that allows requests from a specific origin
     * (http://localhost:3000)
     * and specifies the HTTP methods and headers that are allowed.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // Create a new CorsConfiguration object, which will hold the CORS configuration
        // settings
        CorsConfiguration configuration = new CorsConfiguration();
        // Specifies the allowed origins (i.e., domains) that are permitted to make
        // cross-origin requests to your server
        configuration.setAllowedOrigins(Arrays.asList("staging.onlynotes.net", "www.onlynotes.net", "http://localhost:3000"));
        // Specify the HTTP methods that are allowed for cross-origin requests, which
        // accepts all methods here
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
        // Specify the headers that are allowed for cross-origin requests, which accepts
        // all here
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Allows the inclusion of credentials (e.g., cookies) in cross-origin requests
        configuration.setAllowCredentials(true);
        // Creates a source for CORS configuration
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Applies CORS configuration to all paths on your server
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
