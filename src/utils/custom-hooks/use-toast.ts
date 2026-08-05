import * as React from "react";
import { toastEvents } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "neutral" | "dark";


type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
};

// Maintain toast state outside of React's component lifecycle
let count = 0;
let toasts: ToastProps[] = [];
const subscribers = new Set<(updatedToasts: ToastProps[]) => void>();

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Simple function to notify all subscribers of toast state changes
function notifySubscribers() {
  subscribers.forEach(callback => callback([...toasts]));
}

// Handle toast removal after delay
const scheduleToastRemoval = (id: string) => {
  setTimeout(() => {
    removeToast(id);
  }, TOAST_REMOVE_DELAY);
};

// Add a new toast
function addToast(toast: Omit<ToastProps, "id">) {
  const id = genId();
  const newToast = { ...toast, id };
  
  // Keep only the latest toast if we're at the limit
  if (toasts.length >= TOAST_LIMIT) {
    toasts = [newToast];
  } else {
    toasts = [newToast, ...toasts];
  }
  
  notifySubscribers();
  scheduleToastRemoval(id);
  
  return id;
}

// Remove a toast by ID
function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notifySubscribers();
}

// Set up event listeners
toastEvents.on("DISMISS_TOAST", (id) => {
  removeToast(id);
});

function toast(props: Omit<ToastProps, "id">) {
  const id = addToast(props);
  
  return {
    id,
    dismiss: () => removeToast(id),
    update: (props: Partial<ToastProps>) => {
      toasts = toasts.map(t => t.id === id ? { ...t, ...props } : t);
      notifySubscribers();
    }
  };
}

function useToast() {
  const [state, setState] = React.useState<ToastProps[]>(toasts);
  
  React.useEffect(() => {
    // Subscribe to toast updates
    const callback = (updatedToasts: ToastProps[]) => {
      setState(updatedToasts);
    };
    
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  }, []);
  
  return {
    toasts: state,
    toast,
    dismiss: removeToast
  };
}

export { useToast, toast };