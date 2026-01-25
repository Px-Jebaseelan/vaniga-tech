/**
 * Server Wake-Up Utility
 * Preemptively wakes up the Render server to eliminate cold start delays
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Wake up the server by pinging the health endpoint
 * This is called immediately when the app loads to ensure the server
 * is ready by the time the user tries to login/register
 */
export const wakeUpServer = async (): Promise<void> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for cold starts

        console.log('🔄 Waking up server...');

        await fetch(`${API_URL}/health`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('✅ Server is awake and ready');
    } catch (error) {
        // Server is waking up - this is normal for first request after sleep
        console.log('⏳ Server is waking up in background (this can take 30-60 seconds on first visit)');
    }
};

/**
 * Keep the server alive with periodic pings
 * Call this after user logs in to prevent the server from sleeping
 * during active sessions
 */
export const keepServerAlive = (): (() => void) => {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

    const intervalId = setInterval(async () => {
        try {
            await fetch(`${API_URL}/health`, {
                method: 'GET',
            });
            console.log('🔄 Keep-alive ping sent');
        } catch (error) {
            console.log('⚠️ Keep-alive ping failed');
        }
    }, PING_INTERVAL);

    // Return cleanup function
    return () => {
        clearInterval(intervalId);
        console.log('🛑 Keep-alive stopped');
    };
};

/**
 * Check server status
 * Returns true if server is responsive, false otherwise
 */
export const checkServerStatus = async (): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
};
