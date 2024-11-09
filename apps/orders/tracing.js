const opentelemetry = require("@opentelemetry/sdk-node");
const { AmqplibInstrumentation } = require('@opentelemetry/instrumentation-amqplib');
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc')
const { Resource } = require('@opentelemetry/resources');
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
const { RuntimeNodeInstrumentation } = require("@opentelemetry/instrumentation-runtime-node");

console.log("Tracing started for ORDERS");

const resource = new Resource({
  'service.name': 'orders',
  'environment': process.env.OTEL_ENVIRONMENT
});

const traceExporter = new OTLPTraceExporter({ url: process.env.OTEL_HOST_URL });
const metricExporter = new OTLPMetricExporter({ url: process.env.OTEL_HOST_URL });

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  interval: 30000
})

const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  metricReader: metricReader,
  
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new RuntimeNodeInstrumentation({
      monitoringPrecision: 5000,
    }),
    new AmqplibInstrumentation({
      onReceiveHook: (span, message) => {
        if (message.properties && message.properties.correlationId) {
          span.setAttribute("message.correlation_id", message.properties.correlationId);
        }
      },
      onSendHook: (span, message) => {
        if (message.properties && message.properties.correlationId) {
          span.setAttribute("message.correlation_id", message.properties.correlationId);
        }
      },
    }),
  ],
  serviceName: process.env.SERVICE,
});

sdk.start();

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("OTel Tracing terminated"))
    .catch((error) => console.log("Error terminating OTel tracing", error))
    .finally(() => process.exit(0));
});