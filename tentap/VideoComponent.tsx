import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { autoCreateParagraph } from "./autoCreateParagraph";

interface UnknownProps {
  [x: string]: any;
}

/**
 * The VideoComponent component is a custom node view component for the image extension.
 * It is rendered in webview
 */
export const VideoComponent = (props: UnknownProps & NodeViewProps) => {
  const { editor, node, selected, deleteNode, getPos, ...restProps } = props;
  const { src } = node.attrs;

  if (editor && node) {
    return (
      <NodeViewWrapper>
        <div
          className="myvideo-container"
          data-drag-handle
          onClick={() => autoCreateParagraph(editor, getPos())}
        >
          {src ? (
            <video controls src={src} className="myvideo-video" />
          ) : (
            <span className="myvideo-loading">
              video not uploaded successfully...
            </span>
          )}
          <div className="myvideo-controls">
            <button className="myvideo-button" onClick={() => deleteNode()}>
              remove
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <div
      className="myvideo"
      style={{ backgroundColor: props.backgroundColor ? "red" : "transparent" }}
    >
      <button className="myvideo-button" {...restProps}>
        remove
      </button>
    </div>
  );
};
