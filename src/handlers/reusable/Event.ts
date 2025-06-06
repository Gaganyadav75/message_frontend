type CustomEventListener<T = any> = (event: CustomEvent<T>) => void;

function subscribe<T>(eventName: string, listener: CustomEventListener<T>): void {
    document.addEventListener(eventName, listener as EventListener);
}

function unsubscribe<T>(eventName: string, listener: CustomEventListener<T>): void {
    document.removeEventListener(eventName, listener as EventListener);
}

function publish<T>(eventName: string, data: T): void {
    const event = new CustomEvent<T>(eventName, { detail: data });
    document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
