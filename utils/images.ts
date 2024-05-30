import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { EditorBridge } from "@10play/tentap-editor";
import { randomUUID } from "expo-crypto";

export function ImageID2name(id: string) {
  return `image_${id}.jpeg`;
}

export async function test_insert_attachment(editor: EditorBridge) {
  try {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.2,
      base64: true,
    });

    if (res.canceled) {
      return;
    }

    const { assets } = res;
    if (!assets || assets.length === 0 || !assets[0].base64) {
      return;
    }

    const randomStuff = randomUUID();
    const name = ImageID2name(randomStuff);

    await FileSystem.moveAsync({
      from: res.assets[0].uri,
      to: FileSystem.cacheDirectory + name,
    });

    const data = {
      id: randomStuff,
      base64: assets[0].base64,
      name,
    };
    editor.setBase64Jpeg(data);
    return data;
  } catch (error) {
    console.error("Error in test function: ", error);
  }
}

export async function load_image_from_fs(
  editor: EditorBridge,
  id_list: string[],
) {
  await Promise.all(
    id_list.map(async (id) => {
      try {
        const res = await FileSystem.readAsStringAsync(
          FileSystem.cacheDirectory + ImageID2name(id),
          {
            encoding: FileSystem.EncodingType.Base64,
          },
        );
        editor.addBase64({ id, base64: res });
        editor.setSpecificMyImageShown({ id, shown: true });
      } catch (e) {
        console.debug("fail to load image from fs", e);
      }
    }),
  );
}
