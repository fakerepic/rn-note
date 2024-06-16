import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

export type FileInfo = {
  id: string;
  uri: string;
  name: string;
  type: string;
};

export type UploadedFileInfo = FileInfo & {
  url: string;
};

interface UploadQueueStore {
  uploadQueue: FileInfo[];
  uploadedFiles: UploadedFileInfo[];
  add: (fileInfo: FileInfo) => void;
  remove: (fileId: string) => void;
  clear: () => void;
  appendUploadedFile: (fileInfo: UploadedFileInfo) => void;
  consumeUploadedFiles: (ids: string[]) => UploadedFileInfo[];
}

const uploadQueueStore = create<UploadQueueStore>()(
  persist(
    (set, get) => ({
      uploadQueue: [],
      uploadedFiles: [],
      add: (fileInfo) =>
        set((state) => ({ uploadQueue: [...state.uploadQueue, fileInfo] })),
      remove: (fileId) =>
        set((state) => ({
          uploadQueue: state.uploadQueue.filter((file) => file.id !== fileId),
        })),
      clear: () => set({ uploadQueue: [] }),
      appendUploadedFile: (fileInfo: UploadedFileInfo) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, fileInfo],
        })),
      consumeUploadedFiles: (ids) => {
        const consumedFiles = get().uploadedFiles.filter((file) =>
          ids.includes(file.id),
        );
        set((state) => {
          return {
            uploadedFiles: state.uploadedFiles.filter(
              (file) => !ids.includes(file.id),
            ),
          };
        });
        return consumedFiles;
      },
    }),
    {
      name: "uploadQueue",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useUploadQueue = uploadQueueStore;
