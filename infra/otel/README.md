# OpenTelemetry collector

## Description
Configuration file to set up OpenTelemetry Collector (Contribution) instance. Either use Docker image or otel instlalation.

## Docker Command
To run the OpenTelemetry Collector in a Docker container, use the following command:

```bash
docker run -d --name otel \
   --env-file ./.env \
   -v "C:/Users/Joel/Desktop/school/send-notes/infra/otel/config.yaml:/etc/otelcol-contrib/config.yaml" \
   -p 4317:4317 -p 55681:55681 \
   otel/opentelemetry-collector-contrib:0.112.0
```