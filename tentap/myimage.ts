/**
 * @module tiptap extension: myimage (custom image node)
 */
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { MyImageComponent } from "./MyImageComponent";

export interface MyImageOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    myimage: {
      setMyImage: (options: { id: string }) => ReturnType;
      addBase64: (options: { id: string; base64: string }) => ReturnType;
      setBase64Jpeg: (options: { id: string; base64: string }) => ReturnType;
    };
  }
}

export const MyImage = Node.create<MyImageOptions>({
  name: "myimage",

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      show: {
        default: true,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MyImageComponent);
  },

  parseHTML() {
    return [{ tag: "div[class=myimage]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addStorage() {
    return {
      base64map: {},
    };
  },

  addCommands() {
    return {
      setMyImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      addBase64: (options) => () => {
        this.storage.base64map[options.id] = options.base64;
        return true;
      },
      setBase64Jpeg:
        (options) =>
        ({ commands }) => {
          this.storage.base64map[options.id] = options.base64;
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
