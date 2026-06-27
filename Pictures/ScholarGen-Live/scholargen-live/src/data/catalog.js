// ScholarGen Live — central learning catalog (seed data).
//
// This file is the single source of truth that powers the whole marketplace:
// learning categories, education levels, streams, subjects, examinations,
// promotional banners, pricing packages, family packages and ScholarGen-owned
// group classes.
//
// Everything here is seeded into AppContext at runtime, where Admins can add,
// edit, enable/disable or remove entries WITHOUT a developer changing code.
// Tutors only ever choose from what lives here, and the student-facing screens
// render straight from it — so the platform can expand from academic tutoring
// into a full skills, coaching and mentorship marketplace over time.

let _seq = 0;
// Lightweight unique id generator for admin-created records.
export function makeId(prefix = 'id') {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq}`;
}

// ── 1 & 2. Learning categories ────────────────────────────────────────────
// Two groups: classic "Academic" subjects and the broader
// "Skills & Professional Development" track (used instead of a vague "Others").
export const CATEGORY_GROUPS = ['Academic', 'Skills & Professional Development'];

export const seedCategories = [
  // Academic
  { id: 'cat_math', name: 'Mathematics', group: 'Academic', icon: 'calculator', enabled: true },
  { id: 'cat_physics', name: 'Physics', group: 'Academic', icon: 'planet', enabled: true },
  { id: 'cat_chemistry', name: 'Chemistry', group: 'Academic', icon: 'flask', enabled: true },
  { id: 'cat_english', name: 'English', group: 'Academic', icon: 'book', enabled: true },
  { id: 'cat_exam', name: 'Examination Preparation', group: 'Academic', icon: 'school', enabled: true },

  // Skills & Professional Development
  { id: 'cat_speaking', name: 'Public Speaking', group: 'Skills & Professional Development', icon: 'mic', enabled: true },
  { id: 'cat_leadership', name: 'Leadership', group: 'Skills & Professional Development', icon: 'ribbon', enabled: true },
  { id: 'cat_comm', name: 'Communication Skills', group: 'Skills & Professional Development', icon: 'chatbubbles', enabled: true },
  { id: 'cat_digital', name: 'Digital Skills', group: 'Skills & Professional Development', icon: 'laptop', enabled: true },
  { id: 'cat_graphic', name: 'Graphic Design', group: 'Skills & Professional Development', icon: 'color-palette', enabled: true },
  { id: 'cat_video', name: 'Video Editing', group: 'Skills & Professional Development', icon: 'videocam', enabled: true },
  { id: 'cat_coding', name: 'Coding', group: 'Skills & Professional Development', icon: 'code-slash', enabled: true },
  { id: 'cat_baking', name: 'Baking', group: 'Skills & Professional Development', icon: 'pizza', enabled: true },
  { id: 'cat_catering', name: 'Catering', group: 'Skills & Professional Development', icon: 'restaurant', enabled: true },
  { id: 'cat_fashion', name: 'Fashion Design', group: 'Skills & Professional Development', icon: 'shirt', enabled: true },
  { id: 'cat_music', name: 'Music', group: 'Skills & Professional Development', icon: 'musical-notes', enabled: true },
  { id: 'cat_career', name: 'Career Development', group: 'Skills & Professional Development', icon: 'briefcase', enabled: true },
  { id: 'cat_entrepreneur', name: 'Entrepreneurship', group: 'Skills & Professional Development', icon: 'trending-up', enabled: true },
  { id: 'cat_personal', name: 'Personal Development', group: 'Skills & Professional Development', icon: 'sparkles', enabled: true },
  { id: 'cat_interview', name: 'Interview Preparation', group: 'Skills & Professional Development', icon: 'people', enabled: true },
  { id: 'cat_cert', name: 'Professional Certifications', group: 'Skills & Professional Development', icon: 'medal', enabled: true },
];

// ── 4. Education levels ────────────────────────────────────────────────────
export const seedEducationLevels = [
  { id: 'lvl_nursery', name: 'Nursery', group: 'Early Learning', enabled: true },
  { id: 'lvl_kg', name: 'Kindergarten', group: 'Early Learning', enabled: true },

  { id: 'lvl_pri1', name: 'Primary 1', group: 'Primary School', enabled: true },
  { id: 'lvl_pri2', name: 'Primary 2', group: 'Primary School', enabled: true },
  { id: 'lvl_pri3', name: 'Primary 3', group: 'Primary School', enabled: true },
  { id: 'lvl_pri4', name: 'Primary 4', group: 'Primary School', enabled: true },
  { id: 'lvl_pri5', name: 'Primary 5', group: 'Primary School', enabled: true },
  { id: 'lvl_pri6', name: 'Primary 6', group: 'Primary School', enabled: true },

  { id: 'lvl_jss1', name: 'JSS1', group: 'Junior Secondary', enabled: true },
  { id: 'lvl_jss2', name: 'JSS2', group: 'Junior Secondary', enabled: true },
  { id: 'lvl_jss3', name: 'JSS3', group: 'Junior Secondary', enabled: true },

  { id: 'lvl_ss1', name: 'SS1', group: 'Senior Secondary', enabled: true },
  { id: 'lvl_ss2', name: 'SS2', group: 'Senior Secondary', enabled: true },
  { id: 'lvl_ss3', name: 'SS3', group: 'Senior Secondary', enabled: true },

  { id: 'lvl_uni100', name: '100 Level', group: 'University', enabled: true },
  { id: 'lvl_uni200', name: '200 Level', group: 'University', enabled: true },
  { id: 'lvl_uni300', name: '300 Level', group: 'University', enabled: true },
  { id: 'lvl_uni400', name: '400 Level', group: 'University', enabled: true },
  { id: 'lvl_uni500', name: '500 Level', group: 'University', enabled: true },

  { id: 'lvl_career', name: 'Career Development', group: 'Professional Learning', enabled: true },
  { id: 'lvl_prof_cert', name: 'Professional Certifications', group: 'Professional Learning', enabled: true },
];

// ── 5. Streams (secondary school) ──────────────────────────────────────────
export const seedStreams = [
  { id: 'stream_science', name: 'Science', enabled: true },
  { id: 'stream_arts', name: 'Arts', enabled: true },
  { id: 'stream_commercial', name: 'Commercial', enabled: true },
];

// ── 6. Subjects (admin-controlled) ─────────────────────────────────────────
export const seedSubjects = [
  { id: 'sub_math', name: 'Mathematics', enabled: true },
  { id: 'sub_english', name: 'English Language', enabled: true },
  { id: 'sub_physics', name: 'Physics', enabled: true },
  { id: 'sub_chemistry', name: 'Chemistry', enabled: true },
  { id: 'sub_biology', name: 'Biology', enabled: true },
  { id: 'sub_economics', name: 'Economics', enabled: true },
  { id: 'sub_government', name: 'Government', enabled: true },
  { id: 'sub_literature', name: 'Literature', enabled: true },
  { id: 'sub_accounting', name: 'Accounting', enabled: true },
  { id: 'sub_geography', name: 'Geography', enabled: true },
  { id: 'sub_further_math', name: 'Further Mathematics', enabled: true },
  { id: 'sub_civic', name: 'Civic Education', enabled: true },
];

// ── 7. Examinations (admin-controlled) ─────────────────────────────────────
export const seedExaminations = [
  { id: 'exam_jamb', name: 'JAMB', enabled: true },
  { id: 'exam_waec', name: 'WAEC', enabled: true },
  { id: 'exam_neco', name: 'NECO', enabled: true },
  { id: 'exam_gce', name: 'GCE', enabled: true },
  { id: 'exam_bece', name: 'BECE', enabled: true },
  { id: 'exam_igcse', name: 'IGCSE', enabled: true },
  { id: 'exam_ielts', name: 'IELTS', enabled: true },
  { id: 'exam_toefl', name: 'TOEFL', enabled: true },
  { id: 'exam_sat', name: 'SAT', enabled: true },
  { id: 'exam_gre', name: 'GRE', enabled: true },
  { id: 'exam_gmat', name: 'GMAT', enabled: true },
  { id: 'exam_ican', name: 'ICAN', enabled: true },
  { id: 'exam_acca', name: 'ACCA', enabled: true },
];

// ── 11, 12, 13. Promotional banners ────────────────────────────────────────
// `link` is opened externally (Play/App Store, website) when `linkType` is
// 'external', or used as an internal route name when 'internal'. Admins set all
// of these fields, can enable/disable and schedule banners.
export const seedBanners = [
  {
    id: 'ban_jamb_app',
    title: 'Download ScholarGen JAMB CBT App',
    description: 'Practice thousands of past questions on the go.',
    buttonText: 'Download Now',
    link: 'https://play.google.com/store',
    linkType: 'external',
    colors: ['#10240C', '#1A3312'],
    enabled: true,
    startsAt: null,
    endsAt: null,
  },
  {
    id: 'ban_masterclass',
    title: 'Join Our JAMB Masterclass',
    description: 'Live intensive sessions with top tutors.',
    buttonText: 'Reserve a Seat',
    link: 'GroupClasses',
    linkType: 'internal',
    colors: ['#1E4D14', '#34931A'],
    enabled: true,
    startsAt: null,
    endsAt: null,
  },
  {
    id: 'ban_scholarship',
    title: 'Apply For ScholarGen Scholarship',
    description: 'Funding for outstanding learners across Africa.',
    buttonText: 'Apply Now',
    link: 'https://scholargen.live/scholarship',
    linkType: 'external',
    colors: ['#0D1A09', '#1E4D14'],
    enabled: true,
    startsAt: null,
    endsAt: null,
  },
  {
    id: 'ban_speaking',
    title: 'Register For Public Speaking Bootcamp',
    description: 'Build confidence and command any room.',
    buttonText: 'Register',
    link: 'GroupClasses',
    linkType: 'internal',
    colors: ['#2A4220', '#52BE23'],
    enabled: true,
    startsAt: null,
    endsAt: null,
  },
];

// ── 14. Pricing packages (admin-controlled — tutors never set prices) ──────
export const seedPackages = [
  {
    id: 'pkg_standard',
    name: 'Standard Plan',
    price: 95000,
    period: 'month',
    details: '3 classes/week · 2hrs each',
    features: ['Live Classes', 'Progress Reports', 'Study Plans'],
    popular: false,
    enabled: true,
  },
  {
    id: 'pkg_intensive',
    name: 'Intensive Plan',
    price: 140000,
    period: 'month',
    details: '4 classes/week · 2hrs each',
    features: ['Full Assessments', 'Mentorship', 'Live Classes', 'Progress Reports'],
    popular: true,
    enabled: true,
  },
  {
    id: 'pkg_elite',
    name: 'Elite Mentorship',
    price: 180000,
    period: 'month',
    details: 'Premium · Scholarship-focused',
    features: ['1-on-1 Strategy Mapping', 'Global Opportunities', 'Mentorship'],
    popular: false,
    enabled: true,
  },
];

// ── 15. Family learning packages (admin-controlled) ────────────────────────
export const seedFamilyPackages = [
  {
    id: 'fam_2',
    name: '2 Children Plan',
    children: 2,
    price: 170000,
    discountPercent: 10,
    eligibility: 'One tutor teaching 2 children in the same home.',
    enabled: true,
  },
  {
    id: 'fam_3',
    name: '3 Children Plan',
    children: 3,
    price: 240000,
    discountPercent: 15,
    eligibility: 'One tutor teaching 3 children in the same home.',
    enabled: true,
  },
  {
    id: 'fam_4',
    name: '4 Children Plan',
    children: 4,
    price: 300000,
    discountPercent: 20,
    eligibility: 'One tutor teaching 4 children in the same home.',
    enabled: true,
  },
];

// ── 10. ScholarGen-owned group classes ─────────────────────────────────────
export const seedGroupClasses = [
  {
    id: 'gc_jamb',
    title: 'JAMB Masterclass',
    description: 'Intensive 6-week revision covering all four JAMB subjects.',
    price: 25000,
    schedule: 'Mon · Wed · Fri · 5:00 PM',
    seats: 120,
    enrolled: 86,
    enabled: true,
  },
  {
    id: 'gc_waec',
    title: 'WAEC Revision Class',
    description: 'Theory and objective drills for core WAEC subjects.',
    price: 20000,
    schedule: 'Tue · Thu · 4:00 PM',
    seats: 100,
    enrolled: 64,
    enabled: true,
  },
  {
    id: 'gc_ielts',
    title: 'IELTS Bootcamp',
    description: 'Band 7+ strategies across all four IELTS modules.',
    price: 45000,
    schedule: 'Sat · 10:00 AM',
    seats: 60,
    enrolled: 41,
    enabled: true,
  },
  {
    id: 'gc_speaking',
    title: 'Public Speaking Workshop',
    description: 'Stage presence, storytelling and confident delivery.',
    price: 30000,
    schedule: 'Sun · 2:00 PM',
    seats: 50,
    enrolled: 22,
    enabled: true,
  },
  {
    id: 'gc_career',
    title: 'Career Development Sessions',
    description: 'CV, LinkedIn and interview coaching for professionals.',
    price: 35000,
    schedule: 'Wed · 7:00 PM',
    seats: 80,
    enrolled: 30,
    enabled: true,
  },
];
