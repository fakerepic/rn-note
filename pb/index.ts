import { useEffect, useState } from "react";
import pb from "./client";
import { UsersResponse } from "../__generated__/schema";
import { useQuery } from "@tanstack/react-query";

export default pb;

export const useSession = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    pb.authStore.token !== undefined && pb.authStore.isValid,
  );
  const [userID, setUserID] = useState<string | undefined>(
    pb.authStore.model?.id,
  );
  const [verified, setVerified] = useState<boolean>(
    pb.authStore.model?.verified,
  );
  const [userModel, setUserModel] = useState<UsersResponse | undefined>(
    pb.authStore.model as UsersResponse,
  );

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["users", loggedIn],
    queryFn: async () => {
      if (loggedIn) {
        await pb.collection("users").authRefresh();
      }
      return {};
    },
  });

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setLoggedIn(token !== undefined && pb.authStore.isValid);
      setUserID(model?.id as string | undefined);
      setVerified(model?.verified ?? false);
      setUserModel(model as UsersResponse);
    });
  }, []);

  return { loggedIn, userID, verified, userModel, refetch, isLoading, error };
};

export const logout = () => pb.authStore.clear();
