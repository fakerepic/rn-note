// ID-gen.ts

import * as Crypto from "expo-crypto";

export const UUID = () => Crypto.randomUUID();

export const tiptapExtractTitle = (obj: any) => {
  let title;
  if (obj.content && obj.content[0].type === "heading") {
    const heading = obj.content[0];
    if (heading.content) {
      title = heading.content[0].text || "Untitled";
    }
  }
  return title;
};
