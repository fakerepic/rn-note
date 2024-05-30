/**
 * @module utils function to post message from WebView to EditorBridge in NativeView
 */
type TReverseMessage = {
  type: string;
  payload: any;
};

export function postReverseMessage(msg: TReverseMessage) {
  return (window as any).ReactNativeWebView.postMessage(JSON.stringify(msg));
}
