export type ToastType = 'info' | 'success' | 'error';

function ensureContainer() {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    Object.assign(container.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: '9999',
      pointerEvents: 'none'
    });
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message: string, type: ToastType = 'info', duration = 4500) {
  if (typeof window === 'undefined') return; // SSR safety
  const container = ensureContainer();

  const toast = document.createElement('div');
  toast.className = 'app-toast-item';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.pointerEvents = 'auto';
  toast.style.minWidth = '240px';
  toast.style.maxWidth = '360px';
  toast.style.padding = '12px 14px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 8px 24px rgba(2,6,23,0.12)';
  toast.style.color = '#05203A';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(8px)';
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease';

  // Colors and icon per type
  let bg = '#E6F0FF';
  let accent = '#2563eb';
  let icon = 'ℹ️';
  if (type === 'success') { bg = '#ECFDF5'; accent = '#16A34A'; icon = '✅'; }
  if (type === 'error') { bg = '#FEF2F2'; accent = '#DC2626'; icon = '⚠️'; }

  toast.style.background = bg;

  const iconEl = document.createElement('div');
  iconEl.textContent = icon;
  iconEl.style.fontSize = '18px';

  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';

  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.fontSize = '14px';
  msg.style.color = '#0f1724';
  msg.style.lineHeight = '1.2';

  content.appendChild(msg);

  // close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Fermer la notification');
  Object.assign(closeBtn.style, {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#475569'
  });

  const inner = document.createElement('div');
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.width = '100%';
  inner.appendChild(iconEl);
  inner.appendChild(content);
  inner.appendChild(closeBtn);

  toast.appendChild(inner);
  container.appendChild(toast);

  // entrance
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  let hideTimeout = window.setTimeout(() => {
    dismiss();
  }, duration);

  function dismiss() {
    clearTimeout(hideTimeout);
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    setTimeout(() => {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      // remove container if empty
      if (container && container.childElementCount === 0 && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 200);
  }

  closeBtn.addEventListener('click', dismiss);

  // Pause on hover
  toast.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
  toast.addEventListener('mouseleave', () => {
    hideTimeout = window.setTimeout(dismiss, 2200);
  });
}
