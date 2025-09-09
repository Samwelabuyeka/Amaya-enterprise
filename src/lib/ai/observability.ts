export function emitMetric(name: string, value: number) {
  // For now just console.log; later wire to Prometheus pushgateway or service metrics
  console.log('metric', name, value);
}
