/**
 * @module tiptap extension: audio (custom audio node)
 */
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { AudioComponent } from "./AudioComponent";

export interface AudioOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (options: { id: string }) => ReturnType;
    };
  }
}

export const Audio = Node.create<AudioOptions>({
  name: "audio",

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
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },

  parseHTML() {
    return [{ tag: "div[class=audio]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setAudio:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
