import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { postReverseMessage } from "./ReverseMessage";
import { autoCreateParagraph } from "./autoCreateParagraph";

interface UnknownProps {
  [x: string]: any;
}

/**
 * The AudioComponent component is a custom node view component for the image extension.
 * It is rendered in webview
 */
export const AudioComponent = (props: UnknownProps & NodeViewProps) => {
  const { editor, node, selected, deleteNode, getPos, ...restProps } = props;
  const { id } = node.attrs;

  if (editor && node) {
    return (
      <NodeViewWrapper>
        <div
          className="myaudio"
          data-drag-handle
          onClick={() => autoCreateParagraph(editor, getPos())}
        >
          <div
            className="myaudio-btn"
            onClick={() => {
              // send message to native to play audio
              postReverseMessage({
                type: "play-audio",
                payload: {
                  id,
                },
              });
            }}
          >
            <PlayIcon />
          </div>
          <span className="myaudio-loading">{id}</span>
          <div className="myaudio-close" onClick={deleteNode}>
            <CloseIcon />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <div
      className="myaudio"
      style={{ backgroundColor: props.backgroundColor ? "red" : "transparent" }}
    >
      <button className="myaudio-button" {...restProps}>
        remove
      </button>
    </div>
  );
};

const PlayIcon = () => (
  <svg viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="31" />
    <polygon points="26,18 26,46 46,32" fill="#fff" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="31" />
    <line x1="18" y1="18" x2="46" y2="46" stroke="#fff" strokeWidth="4" />
    <line x1="46" y1="18" x2="18" y2="46" stroke="#fff" strokeWidth="4" />
  </svg>
);
