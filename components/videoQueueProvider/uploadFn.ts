import { FileInfo } from "../../zustand/upload";
import pb from "../../pb";

export async function uploadFn(file: FileInfo) {
  try {
    const formData = new FormData();
    formData.append("id_local", file.id);
    formData.append("video", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    formData.append("owner", pb.authStore.model?.id);
    const res = await pb.collection("videos").create(formData);
    const url: string = pb.getFileUrl(res, res.video);
    return url;
  } catch (e) {
    console.log("e", JSON.stringify(e, null, 2));
    throw e;
  }
}
