FROM nginx:1.27.0
COPY ./nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
