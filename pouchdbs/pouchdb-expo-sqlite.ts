import PouchDB from "pouchdb-core";
import PouchDBExpoFix from "./fix";
import Find from "pouchdb-find";
require("pouchdb-adapter-utils").preprocessAttachments =
  PouchDBExpoFix.fix_pouchdb_adapter_utils();
export default PouchDB.plugin(
  PouchDBExpoFix.build_sqlite_adapter(require("pouchdb-adapter-websql-core")),
).plugin(Find);
