// ScholarGen Live API — typed endpoint map.
//
// Mirrors the backend collection 1:1 so screens call e.g. `api.tutors.list({...})`
// instead of hand-writing URLs. All methods return the unwrapped `data` payload
// (see apiClient) or throw an ApiError.
import { apiGet, apiPost, apiPut } from './apiClient';

export const auth = {
  register: (payload) => apiPost('/auth/register', payload),
  login: (payload) => apiPost('/auth/login', payload),
  logout: () => apiPost('/auth/logout'),
  oauthAuthorize: (provider) => apiGet(`/auth/oauth/${provider}/authorize`),
  oauthCallback: (provider, code) => apiGet(`/auth/oauth/${provider}/callback`, { query: { code } }),
};

export const users = {
  me: () => apiGet('/users/me'),
  updateProfile: (payload) => apiPut('/users/me', payload),
  oauthIntegrations: () => apiGet('/users/me/oauth-integrations'),
};

export const students = {
  profile: () => apiGet('/students/profile'),
  updateProfile: (payload) => apiPut('/students/profile', payload),
  createLearningProfile: (payload) => apiPost('/students/learning-profile', payload),
  sessions: (status) => apiGet('/students/sessions', { query: { status } }),
  payments: () => apiGet('/students/payments'),
  sessionReports: () => apiGet('/students/session-reports'),
  progressReports: () => apiGet('/students/progress-reports'),
  referral: () => apiGet('/students/referral'),
  wallet: () => apiGet('/students/wallet'),
  byId: (studentId) => apiGet(`/students/${studentId}`),
};

export const tutors = {
  list: (query) => apiGet('/tutors/list', { query }),
  profile: () => apiGet('/tutors/profile'),
  updateProfile: (payload) => apiPut('/tutors/profile', payload),
  submitDemoVideo: (videoUrl) => apiPost('/tutors/demo-video', { video_url: videoUrl }),
  setAvailability: (slots) => apiPost('/tutors/availability', { slots }),
  availability: (tutorId) => apiGet(`/tutors/${tutorId}/availability`),
  byId: (tutorId) => apiGet(`/tutors/${tutorId}`),
  myStudents: () => apiGet('/tutors/me/students'),
  mySessions: (status) => apiGet('/tutors/me/sessions', { query: { status } }),
  myRatings: () => apiGet('/tutors/me/ratings'),
  myEarnings: () => apiGet('/tutors/me/earnings'),
  startAssessment: (subjectId) => apiPost('/tutors/assessment/start', { subject_id: subjectId }),
  submitAssessment: (sessionId, answers) =>
    apiPost('/tutors/assessment/submit', { session_id: sessionId, answers }),
  assessmentHistory: () => apiGet('/tutors/assessment/history'),
};

export const packages = {
  list: (query) => apiGet('/packages', { query }),
  byId: (packageId) => apiGet(`/packages/${packageId}`),
};

export const bookings = {
  findTutors: (query) => apiGet('/bookings/tutors', { query }),
  tutorSlots: (tutorId) => apiGet(`/bookings/tutors/${tutorId}/slots`),
  create: (payload) => apiPost('/bookings/create', payload),
};

export const sessions = {
  byId: (sessionId) => apiGet(`/sessions/${sessionId}`),
  cancel: (sessionId, reason) => apiPost(`/sessions/${sessionId}/cancel`, { reason }),
  reschedule: (sessionId, newStartTime) =>
    apiPost(`/sessions/${sessionId}/reschedule`, { new_start_time: newStartTime }),
  submitReport: (payload) => apiPost('/sessions/report', payload),
  submitFeedback: (payload) => apiPost('/sessions/feedback', payload),
  submitProgressReport: (payload) => apiPost('/sessions/progress-report', payload),
};

export const payments = {
  initialize: (payload) => apiPost('/payments/initialize', payload),
  verify: (gateway, reference) => apiGet('/payments/verify', { query: { gateway, reference } }),
  history: () => apiGet('/payments/history'),
};

export const admin = {
  dashboard: () => apiGet('/admin/dashboard'),
  verificationQueue: () => apiGet('/admin/verification-queue'),
  approveTutor: (tutorId) => apiPost(`/admin/tutors/${tutorId}/approve`),
  rejectTutor: (tutorId, reason) => apiPost(`/admin/tutors/${tutorId}/reject`, { reason }),
  upgradeTutorTier: (tutorId, tier) => apiPost(`/admin/tutors/${tutorId}/upgrade-tier`, { tier }),
  manageBadge: (tutorId, badgeSlug, action) =>
    apiPost(`/admin/tutors/${tutorId}/badge`, { badge_slug: badgeSlug, action }),
  complaints: (status) => apiGet('/admin/complaints', { query: { status } }),
  resolveComplaint: (complaintId, payload) =>
    apiPost(`/admin/complaints/${complaintId}/resolve`, payload),
  revenue: () => apiGet('/admin/revenue'),
};

const api = {
  auth,
  users,
  students,
  tutors,
  packages,
  bookings,
  sessions,
  payments,
  admin,
};

export default api;
