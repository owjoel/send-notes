package cs302.notes.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.interfaces.RSAPublicKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = WebUtils.getCookie(request, "access_token").getValue();
        logger.info("TOKEN:"+token);
        if (token != null && validateToken(token)) {
            logger.info("CLAIMS A");
            Claims claims = getClaimsFromToken(token);
            logger.info("CLAIMS B");
            if (claims != null) {
                // Set authentication in the context
                logger.info("CLAIMS C");
                JwtAuthenticationToken authentication = new JwtAuthenticationToken(claims);
                logger.info("CLAIMS D");
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                logger.info("CLAIMS E");
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean validateToken(String token) {
        try {
//            logger.info(JwkUtil.getKidFromTokenHeader(token));
            String kid = JwkUtil.getKidFromTokenHeader(token);
            RSAPublicKey publicKey = JwkUtil.getPublicKey(kid);
            Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            logger.info(e.toString());
            logger.info("VALIDATING TOKEN FALSE");
            return false;
        }
    }

    private Claims getClaimsFromToken(String token) {
        try {
            String kid = JwkUtil.getKidFromTokenHeader(token);
            RSAPublicKey publicKey = JwkUtil.getPublicKey(kid);
            return Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }
}