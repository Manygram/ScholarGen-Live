// Adapters between the API's response shapes and the shapes the UI components
// already expect. Keeping these in one place means screens stay declarative.

// API package -> PackageSelection plan card shape.
export function mapApiPackage(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price_ngn ?? p.price ?? 0,
    period: 'month',
    details:
      p.classes_per_week && p.hours_per_class
        ? `${p.classes_per_week} classes/week · ${p.hours_per_class}hrs each`
        : p.details || '',
    features: p.features || [],
    popular: p.plan_type === 'intensive',
    enabled: true,
  };
}

function formatClock(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

const SESSION_STATUS = {
  scheduled: 'Upcoming',
  active: 'Live',
  completed: 'Completed',
  cancelled: 'Cancelled',
  missed: 'Missed',
};

// API session -> Schedule timeline card shape.
export function mapApiSession(s) {
  const start = formatClock(s.scheduled_start);
  const end = formatClock(s.scheduled_end);
  return {
    id: s.id,
    subject: s.subject || s.subject_name || 'Tutoring Session',
    tutor: s.tutor_name || s.tutor?.full_name || '',
    time: start && end ? `${start} - ${end}` : start || 'Scheduled',
    type: s.learning_mode === 'group' ? 'Group Class' : '1-on-1 Mentorship',
    status: SESSION_STATUS[s.status] || 'Upcoming',
    meetLink: s.google_meet_link || null,
  };
}

// API wallet transaction -> Earnings activity row shape.
export function mapApiTransaction(t) {
  const outgoing = ['payout', 'withdrawal', 'commission'].includes(t.transaction_type);
  const isBonus = ['referral_reward', 'bonus'].includes(t.transaction_type);
  const amount = Math.abs(Number(t.amount) || 0);
  return {
    id: t.id,
    type: outgoing ? 'payout' : isBonus ? 'bonus' : 'session',
    title: t.description || t.transaction_type,
    date: t.created_at ? new Date(t.created_at).toLocaleDateString() : '',
    amount: outgoing ? -amount : amount,
    status: 'cleared',
  };
}

// API tutor -> compact tutor card shape used on Dashboard / Search.
export function mapApiTutor(t) {
  const subject =
    (Array.isArray(t.subjects) && t.subjects[0]) ||
    (Array.isArray(t.exam_specializations) && t.exam_specializations[0]) ||
    'Tutor';
  return {
    id: t.id,
    name: t.full_name,
    subject,
    avatar: t.avatar_url || t.profile_picture || null,
    rating: t.average_rating != null ? Number(t.average_rating).toFixed(1) : null,
  };
}
