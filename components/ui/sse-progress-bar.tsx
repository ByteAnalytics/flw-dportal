import { useEffect, useRef, useState } from "react";
import { Progress } from "./progress";
import { toast } from "sonner";
import { reportStatus } from "@/types/reporting";
import { ExecutableModels } from "@/types/model-execution";
import { extractModelType } from "@/lib/model-execution-utils";
import { useAuthStore } from "@/stores/auth-store";

interface ProgressBarProps {
  modelExecutionId: string;
  modelType: ExecutableModels;
  onStatusChange?: (status: reportStatus) => void;
  initialStatus?: string;
}

export function ModelProgressBar({
  modelExecutionId,
  modelType,
  onStatusChange,
  initialStatus = "",
}: ProgressBarProps) {
  const { accessToken } = useAuthStore.getState();
  const [progress, setProgress] = useState(0);

  const hasShownErrorRef = useRef(false);
  const currentStatusRef = useRef(initialStatus);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    const abortController = new AbortController();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/guarantees/${extractModelType(modelType)}/${modelExecutionId}/progress/stream/`;

    const streamProgress = async () => {
      console.log("[SSE] Connecting to:", url);

      try {
        const response = await fetch(url, {
          signal: abortController.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(
          "[SSE] Connection status:",
          response.status,
          response.statusText,
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Response body is not readable");

        console.log("[SSE] Stream opened, waiting for events...");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("[SSE] Stream closed by server");
            break;
          }

          const lines = decoder.decode(value, { stream: true }).split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            try {
              const payload = JSON.parse(line.substring(6));
              console.log("[SSE] Event received:", payload);

              const clampedProgress = Math.min(
                Math.max(payload.progress ?? 0, 0),
                100,
              );

              setProgress(clampedProgress);

              if (
                payload.status &&
                payload.status !== currentStatusRef.current
              ) {
                console.log(
                  "[SSE] Status changed:",
                  currentStatusRef.current,
                  "→",
                  payload.status,
                );
                currentStatusRef.current = payload.status;
                onStatusChangeRef.current?.(payload.status);
              }

              const isTerminal = [
                "Completed",
                "Failed",
                "Cancelled",
                "Pending_Approval",
              ].includes(payload.status);

              if (isTerminal) {
                console.log("[SSE] Terminal status reached:", payload.status);
                const isFailed = ["Failed", "Validation_Failed"].includes(
                  payload.status,
                );

                if (isFailed && !hasShownErrorRef.current) {
                  hasShownErrorRef.current = true;
                  toast.error(payload, {
                    description: "Model Execution Failed",
                  });
                }

                reader.cancel();
                return;
              }
            } catch {
              console.warn("[SSE] Failed to parse line:", line);
            }
          }
        }
      } catch (error: unknown) {
        if ((error as { name?: string })?.name === "AbortError") {
          console.log(
            "[SSE] Stream aborted (component unmounted or id changed)",
          );
        } else {
          console.error("[SSE] Stream error:", error);
        }
      }
    };

    streamProgress();

    return () => {
      console.log("[SSE] Cleaning up stream for:", modelExecutionId);
      abortController.abort();
    };
  }, [modelExecutionId]);

  return (
    <div className="w-full">
      <Progress value={progress} className="h-2 w-full" />
      <div className="text-xs text-gray-500 mt-1">{progress}%</div>
    </div>
  );
}
