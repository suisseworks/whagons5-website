import type { ReactNode } from 'react';
import styles from './PhoneCrop.module.css';

/**
 * On phones a full app screen shrinks until its text is unreadable. This
 * shows the work area instead: the screen is enlarged past the sidebar to the
 * task names and statuses, and fades out on the right. Wider screens see the
 * whole screen unchanged.
 */
export default function PhoneCrop({ children }: { children: ReactNode }) {
  return <div className={styles.crop}><div className={styles.inner}>{children}</div></div>;
}
