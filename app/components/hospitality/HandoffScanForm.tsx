'use client';

import { FormEvent, useRef, useState } from 'react';
import { trackHospitalityEvent } from './HospitalityAnalytics';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const propertyCounts = ['1 property', '2-5 properties', '6-20 properties', '21+ properties'];
const workflowCategories = [
  'Guest issue or service recovery',
  'Maintenance request',
  'Room readiness or housekeeping',
  'Inspection or standards finding',
  'Shift handoff',
  'Other cross-department workflow',
];

export default function HandoffScanForm() {
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const started = useRef(false);

  const recordStart = () => {
    if (started.current) return;
    started.current = true;
    trackHospitalityEvent('handoff_scan_form_start', { page: 'handoff_scan' });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: form.get('name'),
      company: form.get('company'),
      role: form.get('role'),
      email: form.get('email'),
      phone: form.get('phone'),
      propertyCount: form.get('propertyCount'),
      workflowCategory: form.get('workflowCategory'),
      preferredContact: form.get('preferredContact'),
      consent: form.get('consent') === 'yes',
      website: form.get('website'),
      source: params.get('utm_source') || 'direct',
      campaign: params.get('utm_campaign') || '',
      medium: params.get('utm_medium') || '',
      pageVariant: 'us-hospitality-v1',
      market: 'us',
      language: 'en-US',
      offer: '20-minute-hotel-handoff-leak-scan',
    };

    try {
      const response = await fetch('/api/hospitality-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Your request could not be submitted.');
      }

      setStatus('success');
      trackHospitalityEvent('handoff_scan_form_complete', {
        page: 'handoff_scan',
        property_count: payload.propertyCount,
        workflow_category: payload.workflowCategory,
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Your request could not be submitted. Please email hello@whagons.com.'
      );
      trackHospitalityEvent('handoff_scan_form_error', { page: 'handoff_scan' });
    }
  };

  if (status === 'success') {
    return (
      <div className="pg-success" role="status">
        <span className="pg-success-icon" aria-hidden="true">✓</span>
        <h2 style={{ fontSize: '1.4rem' }}>Your handoff scan request is in.</h2>
        <p>
          The U.S. hospitality lead will review it and respond within one business day.
          Bring one recent handoff that did not go as expected.
        </p>
      </div>
    );
  }

  return (
    <form className="pg-form" onSubmit={submit} onFocus={recordStart}>
      <div className="pg-form-grid">
        <div className="pg-field">
          <label htmlFor="scan-name">Name</label>
          <input id="scan-name" name="name" type="text" autoComplete="name" maxLength={120} required />
        </div>
        <div className="pg-field">
          <label htmlFor="scan-company">Hotel or management company</label>
          <input id="scan-company" name="company" type="text" autoComplete="organization" maxLength={160} required />
        </div>
        <div className="pg-field">
          <label htmlFor="scan-role">Your role</label>
          <input id="scan-role" name="role" type="text" autoComplete="organization-title" maxLength={120} required />
        </div>
        <div className="pg-field">
          <label htmlFor="scan-email">Work email</label>
          <input id="scan-email" name="email" type="email" autoComplete="email" maxLength={200} required />
        </div>
        <div className="pg-field">
          <label htmlFor="scan-phone">Phone <small>Optional unless phone is preferred</small></label>
          <input id="scan-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>
        <div className="pg-field">
          <label htmlFor="scan-property-count">Property count</label>
          <select id="scan-property-count" name="propertyCount" defaultValue="" required>
            <option value="" disabled>Select</option>
            {propertyCounts.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="pg-field pg-field-span">
          <label htmlFor="scan-workflow">Workflow to examine</label>
          <select id="scan-workflow" name="workflowCategory" defaultValue="" required>
            <option value="" disabled>Select one recent handoff</option>
            {workflowCategories.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <fieldset className="pg-radios pg-field-span">
          <legend>Preferred contact method</legend>
          <label><input type="radio" name="preferredContact" value="Email" defaultChecked /> Email</label>
          <label><input type="radio" name="preferredContact" value="Phone" /> Phone</label>
        </fieldset>
      </div>

      <label className="pg-check">
        <input name="consent" type="checkbox" value="yes" required />
        <span>I agree to be contacted about the handoff scan I requested.</span>
      </label>

      <label className="pg-honeypot" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="pg-form-actions">
        <button type="submit" className="pg-btn" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting...' : 'Request My Handoff Scan'}
        </button>
        <p className="pg-note">No obligation to purchase a pilot. We respond within one business day.</p>
      </div>

      {status === 'error' && (
        <p className="pg-alert" role="alert">
          {errorMessage} If the problem continues, email <a href="mailto:hello@whagons.com">hello@whagons.com</a>.
        </p>
      )}
    </form>
  );
}
