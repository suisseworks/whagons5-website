import { WORDMARK_PATH, CHECK_PATH } from './_paths';

interface WhagonsLogoProps {
  height?: number;
  iconColor?: string;
  textColor?: string;
}

/**
 * Whagons full logo: checkmark icon (red) + "whagons" wordmark (ink).
 * Paths extracted from the WhagonsTitle SVG used in whagons5-client.
 */
export default function WhagonsLogo({
  height = 24,
  iconColor = 'var(--red)',
  textColor = 'var(--ink)',
}: WhagonsLogoProps) {
  // Original viewBox is 203x44
  const aspectRatio = 203 / 44;
  const width = height * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 203 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Whagons"
    >
      {/* Wordmark text */}
      <path d={WORDMARK_PATH} fill={textColor} />
      {/* Checkmark icon */}
      <path d={CHECK_PATH} fill={iconColor} />
    </svg>
  );
}
