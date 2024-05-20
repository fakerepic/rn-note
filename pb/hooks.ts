import { useQuery } from "@tanstack/react-query";

import { UsersResponse } from "../__generated__/schema";
import { useAuthStore } from "../zustand/authStore";
import pb from "./client";

export const useUserModel = () =>
  useAuthStore((state) => state.model as UsersResponse);

export const useSession = () =>
  useAuthStore((state) => ({
    loggedIn: state.token !== "",
    verified: state.model?.verified ?? false,
  }));

export const useAuthRefresh = () => {
  const id = useAuthStore((state) => state.model?.id as string);

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      if (id) {
        await pb.collection("users").authRefresh();
      }
      return {};
    },
  });

  return { refetch, isLoading, error };
};
