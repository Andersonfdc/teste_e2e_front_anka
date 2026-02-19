import { useMutation } from '@tanstack/react-query';
import usersService from '@/services/users-service';
import type { ApiError } from '@/services/api/error';
import type { CreateUserRequest, CreateUserResponse } from '@/services/users-service/types';
import { getQueryClient } from '@/lib/get-query-client';
import { userKeys } from './use-fetch-all-users';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = getQueryClient();

  return useMutation<CreateUserResponse, ApiError, CreateUserRequest>({
    mutationFn: async (payload: CreateUserRequest) => usersService.createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });
}
