"use client";
import { useMutation } from '@tanstack/react-query';
import usersService from '@/services/users-service';
import type { ApiError } from '@/services/api/error';
import type { EditUserRequest, EditUserResponse } from '@/services/users-service/types';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from './use-fetch-all-users';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/user';
import { useForm } from 'react-hook-form';
import React from 'react';
import { useSearchParams } from 'next/navigation';

type Variables = { userId: string; data: EditUserRequest };

export interface FormData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export function useEditUser(user: User) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const limitParam = Number(searchParams.get('limit') ?? '10');
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;

  const form = useForm<FormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  }, [user, form]);

  const currentValues = form.watch();
  const hasChanges = React.useMemo(() => {
    return (
      currentValues.name !== user.name ||
      currentValues.email !== user.email ||
      currentValues.role !== user.role ||
      currentValues.isActive !== user.isActive
    );
  }, [currentValues, user]);

  const mutationResult = useMutation<EditUserResponse, ApiError, Variables>({
    mutationFn: async ({ userId, data }: Variables) => usersService.editUser(userId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.list({ page, limit }), refetchType: 'active' });
    },
    onError: async (error) => {
      const message = error.message;
      toast.error(message);
    },
  });

  function buildSubmitHandler(callbacks: { onOpenChange: (open: boolean) => void; onClose: () => void }) {
    return async (data: FormData) => {
      try {
        const payload: EditUserRequest = {};

        if (data.name !== user.name) payload.name = data.name;
        if (data.email !== user.email) payload.email = data.email;
        if (data.role !== user.role) payload.role = data.role;
        if (data.isActive !== user.isActive) payload.toggleStatus = true;

        if (Object.keys(payload).length === 0) {
          callbacks.onOpenChange(false);
          callbacks.onClose();
          return;
        }

        await mutationResult.mutateAsync({ userId: user.id, data: payload });
        toast.success("Usuário editado com sucesso!");
        callbacks.onOpenChange(false);
        callbacks.onClose();
      } catch (error) {
        const err = error as { message?: string };
        if (err?.message) toast.error(err.message);
        // onError in mutation already handles toast for ApiError
      }
    };
  }

  return {
    form,
    hasChanges,
    mutationResult,
    buildSubmitHandler,
  };
}

