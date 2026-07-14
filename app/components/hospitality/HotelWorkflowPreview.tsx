import styles from './Hospitality.module.css';

const rows = [
  ['Guest-floor A/C issue', 'Engineering', '9:30 AM', 'In progress', 'Required'],
  ['Room 418 release', 'Housekeeping lead', '10:15 AM', 'Inspection', 'Checklist'],
  ['Guest follow-up', 'Front desk', '10:30 AM', 'Waiting', 'Acknowledgment'],
];

export default function HotelWorkflowPreview() {
  return (
    <figure className={styles.workflowPreview}>
      <div className={styles.workflowPreviewTopbar}>
        <div>
          <span>Whagons Hospitality</span>
          <strong>Guest issue handoff</strong>
        </div>
        <span className={styles.workflowPreviewLive}>3 active steps</span>
      </div>
      <div className={styles.workflowPreviewHeader} aria-hidden="true">
        <span>Work item</span>
        <span>Owner</span>
        <span>Due</span>
        <span>Status</span>
        <span>Proof</span>
      </div>
      {rows.map(([item, owner, due, status, proof], index) => (
        <div className={styles.workflowPreviewRow} key={item}>
          <span className={styles.workflowPreviewNumber}>0{index + 1}</span>
          <strong>{item}</strong>
          <span data-label="Owner">{owner}</span>
          <span data-label="Due">{due}</span>
          <span data-label="Status">{status}</span>
          <span data-label="Proof">{proof}</span>
        </div>
      ))}
      <figcaption>
        Illustrative U.S. hotel workflow configuration, not a customer result or a final product screenshot.
      </figcaption>
    </figure>
  );
}
