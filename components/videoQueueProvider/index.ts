import { useCallback } from "react";
import { useUploadQueue } from "../../zustand/upload";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { EditorBridge } from "@10play/tentap-editor";
import { Platform } from "react-native";
import { router } from "expo-router";

export { VideoQueueProvider } from "./provider";

export const useVideoPicker = (editor?: EditorBridge) => {
  const addTask = useUploadQueue((state) => state.add);
  const addVideo = useCallback(
    async (opts?: { useCamera?: boolean }) => {
      const picker_opts = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      };
      const result = opts?.useCamera
        ? await ImagePicker.launchCameraAsync(picker_opts)
        : await ImagePicker.launchImageLibraryAsync(picker_opts);

      if (!result.canceled) {
        const { mimeType, uri, fileName, fileSize: size } = result.assets[0];
        const fileSize = Platform.OS === "ios" ? size : await getFileSize(uri);
        if (fileSize && fileSize >= 10000000) {
          router.navigate({
            pathname: "/bottom_sheets",
            params: {
              sheetname: "alert",
              sheetprops:
                "File size is too large. Please upload a file less than 10MB.",
            },
          });
          return true;
        }
        const id = `video:${fileName}-${Date.now()}`;
        if (mimeType && fileName) {
          editor?.setVideo({ id });
          addTask({ id, uri, type: mimeType, name: fileName });
        }
      }
    },
    [addTask, editor],
  );

  return {
    addVideo,
  };
};

const getFileSize = async (fileUri: string) => {
  let fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileInfo.size;
  }
};
