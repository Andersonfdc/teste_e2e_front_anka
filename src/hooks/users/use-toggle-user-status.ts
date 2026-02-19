"use client";
import { useMutation } from '@tanstack/react-query';
import usersService from '@/services/users-service';
import type { ApiError } from '@/services/api/error';
import type { ToggleUserStatusResponse } from '@/services/users-service/types';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from './use-fetch-all-users';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

type Variables = { userId: string };

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const limitParam = Number(searchParams.get('limit') ?? '10');
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;

  return useMutation<ToggleUserStatusResponse, ApiError, Variables>({
    mutationFn: async ({ userId }: Variables) => usersService.toggleUserStatus(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.list({ page, limit }), refetchType: 'active' });
    },
    onError: async (error) => {
      const message = error.message;
      toast.error(message);
    },
  });
}


