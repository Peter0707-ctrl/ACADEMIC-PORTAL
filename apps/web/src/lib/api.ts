const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface RequestOptions extends RequestInit {
  token?: string;
  tenantId?: string;
}

export async function apiClient<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, tenantId, headers, ...customConfig } = options;

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const storedTenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;

  const effectiveToken = token || storedToken;
  const effectiveTenantId = tenantId || storedTenantId;

  const defaultHeaders: Record<string, string> = {};

  if (!(customConfig.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (effectiveToken) {
    defaultHeaders['Authorization'] = `Bearer ${effectiveToken}`;
  }

  if (effectiveTenantId) {
    defaultHeaders['x-tenant-id'] = effectiveTenantId;
  }

  const response = await fetch(`${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: { message: response.statusText } };
    }
    const message = errorData?.error?.message || errorData?.message || 'Network request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  // Handle binary blob responses (like Excel downloads)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('spreadsheetml')) {
    return (await response.blob()) as unknown as T;
  }

  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  auth: {
    login: (credentials: { email: string; pass: string }) =>
      apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: credentials.email, password: credentials.pass }),
      }),
    me: () => apiClient('/auth/me'),
  },

  institutions: {
    list: () => apiClient('/institutions'),
    get: (id: string) => apiClient(`/institutions/${id}`),
    updateSettings: (id: string, settings: any) =>
      apiClient(`/institutions/${id}/settings`, { method: 'PUT', body: JSON.stringify(settings) }),
  },

  academics: {
    getYears: () => apiClient('/academics/academic-years'),
    getClasses: () => apiClient('/academics/classes'),
    getSubjects: () => apiClient('/academics/subjects'),
  },

  people: {
    getStudents: (classId?: string) =>
      apiClient(`/people/students${classId ? `?classId=${classId}` : ''}`),
    getStaff: () => apiClient('/people/staff'),
    getStudent360: (id: string) => apiClient(`/people/students/${id}/360`),
  },

  examinations: {
    list: () => apiClient('/examinations'),
    getSchedule: (id: string) => apiClient(`/examinations/schedules/${id}`),
    downloadTemplate: async (scheduleId: string) => {
      const blob = await apiClient<Blob>(`/examinations/schedules/${scheduleId}/template`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marks_template_${scheduleId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    uploadAndValidateMarks: async (scheduleId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient(`/examinations/schedules/${scheduleId}/upload-validate`, {
        method: 'POST',
        body: formData,
      });
    },
  },

  results: {
    recordDraft: (scheduleId: string, marks: Array<{ studentId: string; rawMark: number; comments?: string }>) =>
      apiClient(`/results/schedules/${scheduleId}/draft`, {
        method: 'POST',
        body: JSON.stringify({ marks }),
      }),
    submit: (scheduleId: string) =>
      apiClient(`/results/schedules/${scheduleId}/submit`, { method: 'POST' }),
    approve: (scheduleId: string, decision: 'APPROVED' | 'RETURNED_FOR_CORRECTION', comments?: string) =>
      apiClient(`/results/schedules/${scheduleId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ decision, comments }),
      }),
    schedulePublication: (scheduleId: string, scheduledAt?: string) =>
      apiClient(`/results/schedules/${scheduleId}/schedule-publication`, {
        method: 'POST',
        body: JSON.stringify({ scheduledAt }),
      }),
    getMyResults: () => apiClient('/results/my-results'),
    getChildResults: (studentId: string) => apiClient(`/results/children/${studentId}`),
  },
};
