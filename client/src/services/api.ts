const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Trainee Profile & Dashboard
  getTraineeDashboard: () => request('/trainee/dashboard'),
  getTraineeProfile: () => request('/trainee/profile'),
  updateTraineeProfile: (data: any) => request('/trainee/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getMyCertificates: () => request('/trainee/certificates'),
  getMyCourses: () => request('/trainee/my-courses'),

  // Courses & Classroom Stream
  getCourses: (params = '') => request(`/courses${params ? '?' + params : ''}`),
  getCourseById: (id: string) => request(`/courses/${id}`),
  enrollCourse: (id: string) => request(`/courses/${id}/enroll`, { method: 'POST' }),
  completeLecture: (courseId: string, lectureIndex: number) => 
    request('/courses/complete-lecture', { method: 'POST', body: JSON.stringify({ courseId, lectureIndex }) }),
  addCourseMaterial: (courseId: string, data: any) => 
    request(`/courses/${courseId}/materials`, { method: 'POST', body: JSON.stringify(data) }),
  addCourseAnnouncement: (courseId: string, data: any) => 
    request(`/courses/${courseId}/announcements`, { method: 'POST', body: JSON.stringify(data) }),

  // Assignments & Google Classroom Submissions
  createAssignment: (data: any) => request('/assignments/create', { method: 'POST', body: JSON.stringify(data) }),
  getCourseAssignments: (courseId: string) => request(`/assignments/course/${courseId}`),
  submitAssignment: (data: any) => request('/assignments/submit', { method: 'POST', body: JSON.stringify(data) }),
  getAssignmentSubmissions: (assignmentId: string) => request(`/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId: string, data: any) => 
    request(`/assignments/submissions/${submissionId}/grade`, { method: 'PUT', body: JSON.stringify(data) }),

  // Trainer Onboarding Application & Admin Review
  submitTrainerApplication: (data: any) => request('/trainer-applications/apply', { method: 'POST', body: JSON.stringify(data) }),
  getTrainerApplications: (status = '') => request(`/trainer-applications${status ? '?status=' + status : ''}`),
  reviewTrainerApplication: (id: string, data: any) => 
    request(`/trainer-applications/${id}/review`, { method: 'PUT', body: JSON.stringify(data) }),

  // MCQ Assessments
  getAssessment: (id: string) => request(`/assessments/${id}`),
  submitAssessment: (assessmentId: string, answers: number[]) => 
    request('/assessments/submit', { method: 'POST', body: JSON.stringify({ assessmentId, answers }) }),
  getMyAttempts: () => request('/assessments/my-attempts'),

  // Trainer Studio
  getTrainerDashboard: () => request('/trainer/dashboard'),
  getTrainerCourses: () => request('/trainer/courses'),
  createCourse: (data: any) => request('/trainer/courses', { method: 'POST', body: JSON.stringify(data) }),
  createAssessment: (data: any) => request('/trainer/assessments', { method: 'POST', body: JSON.stringify(data) }),
  getTraineePerformance: () => request('/trainer/performance'),

  // Admin Command Center
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminUsers: () => request('/admin/users'),
  approveUser: (id: string) => request(`/admin/users/${id}/approve`, { method: 'PUT' }),
  rejectUser: (id: string) => request(`/admin/users/${id}/reject`, { method: 'PUT' }),
  getAnnouncements: () => request('/admin/announcements'),
  createAnnouncement: (data: any) => request('/admin/announcements', { method: 'POST', body: JSON.stringify(data) }),

  // Gemini AI Engine
  getAICompetencyAnalysis: () => request('/ai/competency-analysis'),
  explainTrainerMatch: (trainerId: string) => 
    request('/ai/trainer-match-explanation', { method: 'POST', body: JSON.stringify({ trainerId }) })
};
