import ReactDOM from "react-dom";
import { useToast } from "@/utils/custom-hooks/use-toast";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import View from "../view";

export function Toaster() {
  const { toasts } = useToast();

  return ReactDOM.createPortal(
    <ToastProvider>
      <ToastViewport>
        {toasts.map(function ({
          id,
          title,
          description,
          action,
          variant,
          ...props
        }) {
          return (
            <Toast key={id} id={id} variant={variant} {...props}>
              <View className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </View>
              {action}
            </Toast>
          );
        })}
      </ToastViewport>
    </ToastProvider>,
    document.body,
  );
}
