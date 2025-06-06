// src/components/SingleTabGuard.tsx
import React, { useEffect } from 'react';

const SingleTabGuard: React.FC = () => {
    useEffect(() => {
        const tabId = Date.now().toString();
        localStorage.setItem('tabId', tabId);

        window.addEventListener('storage', (event) => {
            if (event.key === 'tabId' && event.newValue !== tabId) {
                alert('Another tab is already open!');
                
                // Attempt to close the tab
                window.open('', '_self')?.close();
                
                // Fallback (redirect if close fails)
                setTimeout(() => {
                    window.location.href = 'about:blank';  // Redirect to a blank page
                }, 2000);
            }
        });

        return () => {
            localStorage.removeItem('tabId');
        };
    }, []);

    return null;  // No UI elements, it just runs the guard
};

export default SingleTabGuard;
