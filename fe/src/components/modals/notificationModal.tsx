import { useEffect, useRef } from "react";
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function NotificationModal({
  message,
  type = "success",
  onClose,
  timeout = 3000,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  timeout?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, timeout);
    return () => clearTimeout(timer);
  }, [onClose, timeout]);


  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-[120px] right-6 z-[9999] w-80 bg-surface-container-high shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col`}
      role="alert"
    >
      {/* Content */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        {isSuccess ? (
          <CheckCircleIcon className="h-5 w-5 mt-0.5 shrink-0 text-[#1a7a4a]" />
        ) : (
          <XCircleIcon className="h-5 w-5 mt-0.5 shrink-0 text-[#ba1a1a]" />
        )}
        <p className="text-body-sm font-sans text-on-surface flex-1 leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="p-0.5 text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Timeout progress bar */}
      <div className="h-[3px] w-full bg-surface-container-highest relative">
        <div
          className={`absolute top-0 left-0 h-full ${isSuccess ? "bg-[#1a7a4a]" : "bg-[#ba1a1a]"}`}
          style={{
            animation: `shrinkWidth ${timeout}ms linear forwards`
          }}
        />
      </div>
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
