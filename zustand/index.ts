import { clearMessages } from "./chat";
import { cleanNotebookContext } from "./notebookCtx";

export function zustandCleanup() {
  clearMessages();
  cleanNotebookContext();
}
