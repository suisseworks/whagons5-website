'use client';

import { useState, type InputHTMLAttributes } from 'react';

/** GFM task-list checkbox, made tickable so readers can use the checklist. */
export default function CheckItem(props: InputHTMLAttributes<HTMLInputElement>) {
  const [checked, setChecked] = useState(Boolean(props.checked || props.defaultChecked));
  if (props.type !== 'checkbox') return <input {...props} />;
  return (
    <input
      type="checkbox"
      className="check"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
