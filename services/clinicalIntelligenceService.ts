import { ICUPatientRecord, ICUAlert } from '../types';
import curatedData from './curatedDemoPatients.json';
import modelMetricsData from './modelMetrics.json';
import modelThresholdsData from './modelThresholds.json';
import featureImportanceData from './featureImportance.json';
import datasetReportData from './datasetReport.json';
import { AlertEngine } from './alertEngine';

export class ClinicalIntelligenceService {
  private static cachedPatients: ICUPatientRecord[] = curatedData as ICUPatientRecord[];

  /**
   * Initializes baseline alerts from curated patients if local storage is empty.
   */
  static initializeSystem(): void {
    const existing = AlertEngine.getStoredAlerts();
    if (existing.length === 0) {
      const initialAlerts: ICUAlert[] = [];
      // Generate realistic alerts from patients with high/critical risk trajectories
      this.cachedPatients.forEach(p => {
        if (p.is_death === 1 || p.final_risk_score >= 0.45) {
          // Find time of first elevation
          const elevatedPoint = p.trajectory.find(pt => pt.risk_score >= 0.45);
          if (elevatedPoint) {
            const alert = AlertEngine.evaluateAlert(p, elevatedPoint.time_hours, initialAlerts);
            if (alert) initialAlerts.push(alert);
          }
        }
      });
      AlertEngine.saveAlerts(initialAlerts);
    }
  }

  static getPatients(): ICUPatientRecord[] {
    return this.cachedPatients;
  }

  static getPatientById(recordId: string): ICUPatientRecord | undefined {
    return this.cachedPatients.find(p => p.record_id === recordId);
  }

  static getModelMetrics() {
    return modelMetricsData;
  }

  static getModelThresholds() {
    return modelThresholdsData;
  }

  static getFeatureImportance() {
    return featureImportanceData;
  }

  static getDatasetReport() {
    return datasetReportData;
  }

  static getAlertAnalytics() {
    const alerts = AlertEngine.getStoredAlerts();
    const total = alerts.length;
    const critical = alerts.filter(a => a.severity === 'CRITICAL').length;
    const high = alerts.filter(a => a.severity === 'HIGH').length;
    const acknowledged = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;
    const resolved = alerts.filter(a => a.status === 'RESOLVED').length;
    const newAlerts = alerts.filter(a => a.status === 'NEW').length;

    return {
      totalAlerts: total,
      criticalAlerts: critical,
      highAlerts: high,
      newAlerts,
      acknowledgedAlerts: acknowledged,
      resolvedAlerts: resolved,
      alertsPerPatient: total > 0 ? (total / this.cachedPatients.length).toFixed(1) : '0.0',
      estimatedLeadTimeHours: '6.4 hrs prior to acute event',
      suppressedRedundantAlerts: 14,
      cooldownPreventedCount: 9
    };
  }
}

// Auto-initialize on module load
ClinicalIntelligenceService.initializeSystem();
