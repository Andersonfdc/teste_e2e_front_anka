import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import authRoutes from "@/services/auth-services";
import type { TokenModel } from "@/services/auth-services/types";

export interface UseGetMeResult {
  isGetMeLoading: boolean;
  isGetMeError: boolean;
  isGetMeSuccess: boolean;
  getMeError: Error | null;
  getMeRefetch: () => Promise<QueryObserverResult<TokenModel | null, Error>>;
  user: TokenModel | null;
}

export const listUseGetMeKeys = () => ["auth", "me"];

export function useGetMe(): UseGetMeResult {
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useQuery<TokenModel | null>({
      queryKey: listUseGetMeKeys(),
      queryFn: async () => {
        const data = await authRoutes.me();
        return data.user;
      },
      retry: false,
    });

  return {
    isGetMeLoading: isLoading,
    isGetMeError: isError,
    isGetMeSuccess: isSuccess,
    getMeError: error,
    getMeRefetch: refetch,
    user: data ?? null,
  };
}
