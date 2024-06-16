/**
 * @module tiptap extension: video (custom video node)
 */
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { VideoComponent } from "./VideoComponent";

export interface VideoOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { id: string; src?: string }) => ReturnType;
      completeSrc: (options: { id: string; src: string }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",

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
      src: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },

  parseHTML() {
    return [{ tag: "div[class=video]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      completeSrc:
        (options) =>
        ({ editor }) => {
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === "video" && node.attrs.id === options.id) {
              const tr = editor.state.tr;
              tr.setMeta("addToHistory", false);
              tr.setNodeAttribute(pos, "src", options.src);
              editor.view.dispatch(tr);
              return false;
            }
          });
          return true;
        },
    };
  },
});
