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
