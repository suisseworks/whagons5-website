import { useState, FormEvent } from 'react';
import { translations, Language } from '../i18n';

interface SignupFormProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

const ZAPIER_WEBHOOKS = {
  en: 'https://hooks.zapier.com/hooks/catch/23330707/uskle6l/',
  es: 'https://hooks.zapier.com/hooks/catch/23330707/u8mjtmv/',
};

export default function SignupForm({ language, isOpen, onClose }: SignupFormProps) {
  const t = translations[language];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setStatus('error');
      return;
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch(ZAPIER_WEBHOOKS[language], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          language: language,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="signup-form-overlay" onClick={handleOverlayClick}>
      <div className="signup-form-modal">
        <button 
          className="signup-form-close" 
          onClick={onClose}
          aria-label={t.formCancelButton}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="signup-form-content">
          <h2 className="signup-form-title">{t.formTitle}</h2>
          <p className="signup-form-subtitle">{t.formSubtitle}</p>

          {status === 'success' ? (
            <div className="signup-form-success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>{t.formSuccessMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-form-field">
                <label htmlFor="name" className="signup-form-label">
                  {t.formNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="signup-form-input"
                  placeholder={t.formNameLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="signup-form-field">
                <label htmlFor="email" className="signup-form-label">
                  {t.formEmailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-form-input"
                  placeholder={t.formEmailLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {status === 'error' && (
                <div className="signup-form-error">
                  {t.formErrorMessage}
                </div>
              )}

              <div className="signup-form-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="signup-form-cancel"
                  disabled={isSubmitting}
                >
                  {t.formCancelButton}
                </button>
                <button
                  type="submit"
                  className="signup-form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '...' : t.formSubmitButton}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
