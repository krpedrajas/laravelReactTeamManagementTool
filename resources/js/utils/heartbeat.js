export async function heartbeat(setSelfLastActiveAt) {
    try {
        const response = await fetch('/heartbeat', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
            },
        });

        if (response.ok) {
            setSelfLastActiveAt(new Date().toISOString());
            return true;
        }

        return false;
    } catch (error) {
        console.error('Heartbeat failed:', error);
        return false;
    }
}