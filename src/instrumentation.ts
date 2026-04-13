import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const options = {
    url: process.env.OTEL_EXPORTER_OTLP,
    compression: CompressionAlgorithm.GZIP,
};

const metricExporter = new OTLPMetricExporter(options);
const traceExporter = new OTLPTraceExporter(options);
const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 15000,
    exportTimeoutMillis: 15000,
});

const sdk = new NodeSDK({
    metricReader,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-app",
        [ATTR_SERVICE_VERSION]: "1.0.0",
    }),
});

sdk.start();
