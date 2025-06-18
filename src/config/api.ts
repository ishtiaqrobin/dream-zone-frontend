// config/api.ts

const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "https://dream-zone-backend.vercel.app/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    checkToken: `${API_BASE_URL}/auth/check-token`,

    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: (token: string) =>
      `${API_BASE_URL}/auth/verify-email/${token}`,
    sendVerificationEmail: `${API_BASE_URL}/auth/send-verification-email`,

    profile: {
      get: `${API_BASE_URL}/auth/profile`,
      update: `${API_BASE_URL}/auth/profile`,
    },

    // Users endpoints
    users: {
      getAll: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
      }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.role) queryParams.append("role", params.role);
        return `${API_BASE_URL}/auth/users?${queryParams.toString()}`;
      },
      getAllForAdmin: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.role) queryParams.append("role", params.role);
        if (params?.status) queryParams.append("status", params.status);
        return `${API_BASE_URL}/auth/users/all?${queryParams.toString()}`;
      },
      getById: (id: string) => `${API_BASE_URL}/auth/users/${id}`,
      updateStatus: (id: string) => `${API_BASE_URL}/auth/users/${id}/status`,

      getBalance: `${API_BASE_URL}/auth/users/balance`,
      getWithdrawHistory: `${API_BASE_URL}/auth/users/withdrawals`,
      requestWithdraw: `${API_BASE_URL}/auth/users/withdrawals`,
      getWithdrawRequests: `${API_BASE_URL}/auth/users/withdrawals/requests`,
      approveWithdraw: (requestId: string) =>
        `${API_BASE_URL}/auth/users/withdrawals/${requestId}/approve`,
      rejectWithdraw: (requestId: string) =>
        `${API_BASE_URL}/auth/users/withdrawals/${requestId}/reject`,
      getTransactions: `${API_BASE_URL}/auth/users/transactions`,
      updateBalance: (userId: string) =>
        `${API_BASE_URL}/auth/users/${userId}/balance`,

      activateUser: (userId: string) =>
        `${API_BASE_URL}/auth/users/${userId}/activate`,
      deactivateUser: (userId: string) =>
        `${API_BASE_URL}/auth/users/${userId}/deactivate`,
      generateReferralId: (userId: string) =>
        `${API_BASE_URL}/auth/users/${userId}/referral`,
      verifyPayment: (userId: string) =>
        `${API_BASE_URL}/auth/users/${userId}/verify-payment`,
      getActivationRequests: `${API_BASE_URL}/auth/users/activation-requests`,
    },
  },
  // Add other endpoints here
} as const;

interface RequestOptions {
  method?: string;
  body?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
}

export const apiRequest = async (url: string, options?: RequestOptions) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};
