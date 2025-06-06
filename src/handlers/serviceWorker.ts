

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker Registered:', registration);
            return registration;
        } catch (error) {
            console.error('Service Worker Registration Failed:', error);
        }
    }
};