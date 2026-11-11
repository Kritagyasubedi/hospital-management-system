import { ICUAlert, ICUAuditLog, ICUPatientRecord, ContributingSignal, ICUAlertStatus } from '../types';
import curatedData from './curatedDemoPatients.json';

const ALERTS_STORAGE_KEY = 'neuronexus_icu_alerts';
const AUDIT_STORAGE_KEY = 'neuronexus_icu_audit_logs';

export class AlertEngine {
  // Alert Thresholds
  static readonly CRITICAL_THRESHOLD = 0.70;
  static readonly HIGH_THRESHOLD = 0.45;
  static readonly COOLDOWN_HOURS = 4.0;
  static readonly PERSISTENCE_WINDOW_STEPS = 2;

  /**
   * Generates default baseline alerts from curated patients so the alert center is never empty.
   */
  private static generateDefaultAlerts(): ICUAlert[] {
    const patients = curatedData as ICUPatientRecord[];
    const defaultAlerts: ICUAlert[] = [];

    patients.forEach(p => {
      const highestPt = [...p.trajectory].sort((a, b) => b.risk_score - a.risk_score)[0];
      if (highestPt && highestPt.risk_score >= 0.35) {
        const severity: 'CRITICAL' | 'HIGH' = highestPt.risk_score >= 0.70 ? 'CRITICAL' : 'HIGH';
        const isAck = p.record_id === '132605' || p.record_id === '132622';
        const isResolved = p.record_id === '132617';
        
        defaultAlerts.push({
          id: `ALT-${p.record_id}-T${Math.round(highestPt.time_hours * 10)}`,
          patientId: p.record_id,
          bedId: p.bed_id,
          timestamp: new Date(Date.now() - (48 - highestPt.time_hours) * 3600000).toISOString(),
          simulationTimeHours: highestPt.time_hours,
          severity,
          riskScore: highestPt.risk_score,
          confidence: 0.92,
          status: isResolved ? 'RESOLVED' : (isAck ? 'ACKNOWLEDGED' : 'NEW'),
          acknowledgedBy: (isAck || isResolved) ? 'Dr. Evelyn Reed (Attending)' : undefined,
          acknowledgedAt: (isAck || isResolved) ? new Date(Date.now() - 3600000).toISOString() : undefined,
          resolvedBy: isResolved ? 'Dr. Evelyn Reed (Attending)' : undefined,
          resolvedAt: isResolved ? new Date(Date.now() - 1800000).toISOString() : undefined,
          contributingSignals: highestPt.contributing_signals.map(sig => ({
            signal: sig,
            value: 'Elevated Parameter',
            trend: '↑ Escalating',
            category: 'Hemodynamic'
          })),
          explanation: `Patient at Bed ${p.bed_id} (${p.icu_type}) reached ${(highestPt.risk_score * 100).toFixed(1)}% deterioration probability at T+${highestPt.time_hours.toFixed(0)}h. Primary drivers: ${highestPt.contributing_signals.slice(0, 2).join(', ')}.`,
          dataQuality: highestPt.data_quality,
          modelVersion: 'early-warning-v1.0'
        });
      }
    });

    return defaultAlerts;
  }

  private static generateDefaultAuditLogs(alerts: ICUAlert[]): ICUAuditLog[] {
    const defaultLogs: ICUAuditLog[] = [];
    alerts.forEach((alt, i) => {
      defaultLogs.push({
        id: `AUD-GEN-${i + 1}`,
        userId: 'Early Warning Engine (ML)',
        action: 'PREDICTION_GENERATED',
        patientId: alt.patientId,
        timestamp: alt.timestamp,
        metadata: { bedId: alt.bedId, riskScore: alt.riskScore, severity: alt.severity }
      });

      if (alt.acknowledgedBy && alt.acknowledgedAt) {
        defaultLogs.push({
          id: `AUD-ACK-${i + 1}`,
          userId: alt.acknowledgedBy,
          action: 'ALERT_ACKNOWLEDGED',
          patientId: alt.patientId,
          timestamp: alt.acknowledgedAt,
          metadata: { alertId: alt.id, bedId: alt.bedId, note: 'Reviewed telemetry stream. Ordered arterial blood gas and IV fluids.' }
        });
      }

      if (alt.resolvedBy && alt.resolvedAt) {
        defaultLogs.push({
          id: `AUD-RES-${i + 1}`,
          userId: alt.resolvedBy,
          action: 'ALERT_RESOLVED',
          patientId: alt.patientId,
          timestamp: alt.resolvedAt,
          metadata: { alertId: alt.id, bedId: alt.bedId, note: 'Patient stabilized following vasopressor titration.' }
        });
      }
    });

    return defaultLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Retrieves all alerts from localStorage or initialized state.
   */
  static getStoredAlerts(): ICUAlert[] {
    try {
      const data = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse alerts from storage:', e);
    }
    
    // Initialize default alerts
    const defaults = this.generateDefaultAlerts();
    this.saveAlerts(defaults);
    return defaults;
  }

  /**
   * Saves alerts to localStorage.
   */
  static saveAlerts(alerts: ICUAlert[]): void {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save alerts to storage:', e);
    }
  }

  /**
   * Logs an audit trail event.
   */
  static logAudit(action: ICUAuditLog['action'], patientId: string, userId = 'Staff / Doctor', metadata?: Record<string, any>): void {
    try {
      const logs = this.getAuditLogs();
      const newEntry: ICUAuditLog = {
        id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId,
        action,
        patientId,
        timestamp: new Date().toISOString(),
        metadata
      };
      logs.unshift(newEntry);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 200)));
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }
  }

  /**
   * Retrieves audit logs.
   */
  static getAuditLogs(): ICUAuditLog[] {
    try {
      const data = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read audit logs:', e);
    }

    const alerts = this.getStoredAlerts();
    const defaultAudit = this.generateDefaultAuditLogs(alerts);
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(defaultAudit));
    } catch (e) {}
    return defaultAudit;
  }

  /**
   * Evaluates patient trajectory at a specific simulation time and generates alerts
   * enforcing threshold, persistence, confidence/data-quality, and cooldown checks.
   */
  static evaluateAlert(
    patient: ICUPatientRecord,
    currentTimeHours: number,
    existingAlerts: ICUAlert[]
  ): ICUAlert | null {
    // 1. Get trajectory history up to currentTimeHours
    const validHistory = patient.trajectory.filter(p => p.time_hours <= currentTimeHours);
    if (validHistory.length === 0) return null;

    const currentPoint = validHistory[validHistory.length - 1];
    const riskScore = currentPoint.risk_score;

    // 2. Data Quality check
    if (currentPoint.data_quality < 0.3) {
      return null;
    }

    // 3. Threshold Check
    let candidateSeverity: 'HIGH' | 'CRITICAL' | null = null;
    if (riskScore >= this.CRITICAL_THRESHOLD) {
      candidateSeverity = 'CRITICAL';
    } else if (riskScore >= this.HIGH_THRESHOLD) {
      candidateSeverity = 'HIGH';
    } else {
      return null;
    }

    // 4. Persistence Requirement
    let isPersistent = false;
    if (validHistory.length >= 2) {
      const prevPoint = validHistory[validHistory.length - 2];
      const jump = riskScore - prevPoint.risk_score;
      if (prevPoint.risk_score >= this.HIGH_THRESHOLD || jump >= 0.20) {
        isPersistent = true;
      }
    } else if (riskScore >= this.CRITICAL_THRESHOLD) {
      isPersistent = true;
    }

    if (!isPersistent) {
      return null;
    }

    // 5. Cooldown & Duplicate Suppression Check
    const patientAlerts = existingAlerts.filter(a => a.patientId === patient.record_id);
    const recentAlert = patientAlerts.sort((a, b) => (b.simulationTimeHours || 0) - (a.simulationTimeHours || 0))[0];

    if (recentAlert && recentAlert.simulationTimeHours !== undefined) {
      const hoursSinceLastAlert = currentTimeHours - recentAlert.simulationTimeHours;

      if (hoursSinceLastAlert < this.COOLDOWN_HOURS) {
        if (!(recentAlert.severity === 'HIGH' && candidateSeverity === 'CRITICAL')) {
          return null;
        }
      }
    }

    // 6. Build Contributing Signals
    const contributing: ContributingSignal[] = currentPoint.contributing_signals.map(sig => {
      let category: ContributingSignal['category'] = 'General';
      if (sig.includes('respiratory') || sig.includes('Tachypnea')) category = 'Respiratory';
      else if (sig.includes('MAP') || sig.includes('blood pressure') || sig.includes('Tachycardia') || sig.includes('HR')) category = 'Hemodynamic';
      else if (sig.includes('GCS') || sig.includes('Neurological')) category = 'Neurological';
      else if (sig.includes('lactate')) category = 'Metabolic';

      return {
        signal: sig,
        value: 'Abnormal Trajectory',
        trend: '↑ Escalating trend',
        category
      };
    });

    const explanation = `Patient at Bed ${patient.bed_id} demonstrates an acute deterioration trajectory with predicted risk at ${(riskScore * 100).toFixed(1)}% (${candidateSeverity} risk state). Primary driving signals include: ${currentPoint.contributing_signals.slice(0, 3).join(', ')}.`;

    const newAlert: ICUAlert = {
      id: `ALT-${patient.record_id}-T${Math.round(currentTimeHours * 10)}-${Date.now().toString().slice(-4)}`,
      patientId: patient.record_id,
      bedId: patient.bed_id,
      timestamp: new Date().toISOString(),
      simulationTimeHours: currentTimeHours,
      severity: candidateSeverity,
      riskScore,
      confidence: Math.min(0.96, Math.max(0.70, 1.0 - Math.abs(0.5 - riskScore) * 0.3)),
      status: 'NEW',
      contributingSignals: contributing,
      explanation,
      dataQuality: currentPoint.data_quality,
      modelVersion: 'early-warning-v1.0'
    };

    this.logAudit('PREDICTION_GENERATED', patient.record_id, 'Alert Engine', {
      riskScore,
      severity: candidateSeverity,
      simulationTimeHours: currentTimeHours
    });

    return newAlert;
  }

  /**
   * Acknowledges an alert by a doctor/nurse.
   */
  static acknowledgeAlert(alertId: string, acknowledgedBy = 'Dr. Evelyn Reed'): ICUAlert[] {
    const alerts = this.getStoredAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert && alert.status === 'NEW') {
      alert.status = 'ACKNOWLEDGED';
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();
      this.saveAlerts(alerts);
      this.logAudit('ALERT_ACKNOWLEDGED', alert.patientId, acknowledgedBy, { alertId });
    }
    return alerts;
  }

  /**
   * Resolves an alert.
   */
  static resolveAlert(alertId: string, resolvedBy = 'Dr. Evelyn Reed'): ICUAlert[] {
    const alerts = this.getStoredAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'RESOLVED';
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date().toISOString();
      this.saveAlerts(alerts);
      this.logAudit('ALERT_RESOLVED', alert.patientId, resolvedBy, { alertId });
    }
    return alerts;
  }
}
