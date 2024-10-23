const opentelemetry = require("@opentelemetry/sdk-node");
const { AmqplibInstrumentation } = require('@opentelemetry/instrumentation-amqplib');
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: 'http://localhost:4317' }),
  instrumentations: [
    new AmqplibInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
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

// // tracing.js
// const { NodeSDK } = require('@opentelemetry/sdk-node')
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto')
// const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
// const { BatchSpanProcessor, SamplingDecision } = require('@opentelemetry/sdk-trace-base')
// const { trace } = require('@opentelemetry/api')

// const exporter = new OTLPTraceExporter({
//   timeoutMillis: 2000,
// })

// const sdk = new NodeSDK({
//   instrumentations: [getNodeAutoInstrumentations()],
//   spanProcessors: new BatchSpanProcessor(exporter),
//   sampler: {
//     shouldSample: (context, traceId, spanName, spanKind, attributes, links) => {
//       const isChecklySpan = trace.getSpan(context)?.spanContext()?.traceState?.get('checkly')
//       if (isChecklySpan) {
//         return { decision: SamplingDecision.RECORD_AND_SAMPLED }
//       } else {
//         return { decision: SamplingDecision.NOT_RECORD }
//       }
//     },
//   },
// })

// sdk.start()