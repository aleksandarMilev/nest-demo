export class HealthReportDto {
  status: 'ok' | 'error';
  info?: Record<string, any> | null;
  error?: Record<string, any> | null;
  details: Record<string, any>;
}
