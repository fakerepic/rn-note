import { useTenTap, TenTapStartKit } from "@10play/tentap-editor";
import { EditorContent } from "@tiptap/react";
import React from "react";

import { UtilBridge } from "../utilBridge";
import { MyImageBridge } from "../myImageBridge";
import { MyImage } from "../myimage";

/**
 * Here we control the web side of our custom editor
 */
export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [
      ...TenTapStartKit,
      MyImageBridge,
      UtilBridge,
    ],
    tiptapOptions: {
      extensions: [MyImage],
    },
  });
  return <EditorContent editor={editor} />;
};
