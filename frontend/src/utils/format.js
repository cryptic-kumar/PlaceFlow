export function bandTagClass(band) {
  switch (band) {
    case 'NORMAL': return 'tag tag-normal';
    case 'DREAM': return 'tag tag-dream';
    case 'SUPER_DREAM': return 'tag tag-super_dream';
    default: return 'tag';
  }
}

export function bandLabel(band) {
  switch (band) {
    case 'NORMAL': return 'Normal (< 5 LPA)';
    case 'DREAM': return 'Dream (5–10 LPA)';
    case 'SUPER_DREAM': return 'Super Dream (> 10 LPA)';
    default: return band;
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
