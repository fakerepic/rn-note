import { useTenTap, TenTapStartKit } from "@10play/tentap-editor";
import { EditorContent } from "@tiptap/react";
import React from "react";

import { UtilBridge } from "../utilBridge";
import { MyImageBridge } from "../myImageBridge";
import { MyImage } from "../myimage";
import { AudioBridge } from "../audioBridge";
import { Audio } from "../audio";
import { VideoBridge } from "../videoBridge";
import { Video } from "../video";

/**
 * Here we control the web side of our custom editor
 */
export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [
      ...TenTapStartKit,
      MyImageBridge,
      UtilBridge,
      AudioBridge,
      VideoBridge,
    ],
    tiptapOptions: {
      extensions: [MyImage, Audio, Video],
    },
  });
  return <EditorContent editor={editor} />;
};
