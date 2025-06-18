// hooks/useTokenRefresh.js

import { useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const useTokenRefresh = () => {
    useEffect(() => {
        const checkAndRefreshToken = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');

                if (!accessToken || !refreshToken) {
                    console.log('No tokens found');
                    return;
                }

                // Access token decode করে expiry time চেক
                const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
                const expiryTime = tokenData.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                const timeLeft = expiryTime - currentTime;

                // যদি 1 মিনিটের কম সময় বাকি থাকে
                if (timeLeft <= 60000) {
                    console.log('Token about to expire, refreshing...');
                    const response = await apiRequest(API_ENDPOINTS.auth.refreshToken, {
                        method: "POST",
                        body: JSON.stringify({ refreshToken })
                    });

                    if (response.accessToken) {
                        localStorage.setItem('accessToken', response.accessToken);
                        console.log('Token refreshed successfully');
                    }
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                // refresh token invalid হলে লগআউট
                if (error.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }
        };

        // API রেসপন্স ইন্টারসেপ্টর - নতুন টোকেন হ্যান্ডেল করার জন্য
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            const clonedResponse = response.clone();

            try {
                const data = await clonedResponse.json();

                // যদি প্রোফাইল আপডেট রেসপন্সে নতুন টোকেন থাকে
                if (data.accessToken && data.refreshToken) {
                    console.log('New tokens received from profile update');
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            } catch (error) {
                // JSON পার্স করা সম্ভব না হলে ইগনোর করব
            }

            return response;
        };

        // প্রথম চেক
        checkAndRefreshToken();

        // প্রতি 1 মিনিট পর পর চেক
        const intervalId = setInterval(checkAndRefreshToken, 60 * 1000);

        return () => {
            clearInterval(intervalId);
            // ফেচ ইন্টারসেপ্টর রিস্টোর
            window.fetch = originalFetch;
        };
    }, []);
};

export default useTokenRefresh; 