import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React, { useEffect, useState } from "react";

interface UnknownProps {
  [x: string]: any;
}

/**
 * The MyImageComponent component is a custom node view component for the image extension.
 * It is rendered in webview
 */
export const MyImageComponent = (props: UnknownProps & NodeViewProps) => {
  const { editor, extension, node, backgroundColor, deleteNode, ...restProps } =
    props;
  const { id, show } = node.attrs;
  const [inited, setInited] = useState<boolean>(false);

  useEffect(() => setInited((prev) => (prev ? true : show)), [show]);

  if (editor && node) {
    return (
      <NodeViewWrapper>
        <div className="myimage" data-drag-handle>
          {inited ? (
            <img
              className="myimage-img"
              src={`data:image/jpeg;base64,${extension.storage.base64map[id]}`}
            />
          ) : (
            <span className="myimage-loading">loading...</span>
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <div
      className="myimage"
      style={{ backgroundColor: props.backgroundColor ? "red" : "transparent" }}
    >
      <span>efefe</span>
      <button className="myimage-button" {...restProps}>
        remove
      </button>
    </div>
  );
};
