import { useEffect, useRef } from "react";
import { FileInfo, useUploadQueue } from "../../zustand/upload";
import { useMutation } from "@tanstack/react-query";
import { uploadFn } from "./uploadFn";
import { useCurrentBridge } from "../../zustand/editor";

export function QueueProvider({
  uploadFn,
  children,
}: {
  uploadFn: (file: FileInfo) => Promise<string>;
  children: React.ReactNode;
}) {
  const uploadQueue = useUploadQueue((s) => s.uploadQueue);
  const isFired = useRef(false);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFn,
    retry: 3,
  });

  const editor = useCurrentBridge();
  useEffect(() => {
    if (uploadQueue.length === 0) return;

    if (!isPending && !isFired.current) {
      isFired.current = true;
      const file = uploadQueue[0];
      mutate(file, {
        // onSettled is called when the mutation is either resolved or rejected
        onSettled: (url) => {
          isFired.current = false;
          useUploadQueue.getState().remove(file.id);
          if (url) {
            if (editor) {
              editor.completeVideo({
                id: file.id,
                src: url,
              });
            } else {
              useUploadQueue.getState().appendUploadedFile({
                ...file,
                url,
              });
            }
          }
        },
      });
    }
  }, [uploadQueue, mutate, isPending, editor]);

  return <>{children}</>;
}

export const VideoQueueProvider = (props: { children: React.ReactNode }) => (
  <QueueProvider uploadFn={uploadFn} {...props} />
);
