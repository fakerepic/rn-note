import pb from "./client";

export default pb;

export * from "./hooks";

export const logout = () => pb.authStore.clear();
