import { useQuery } from '@tanstack/react-query';
import usersService from '@/services/users-service';
import { FetchUsersRequest } from '@/services/users-service/types';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: FetchUsersRequest) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Custom hook for fetching users
export function useFetchAllUsers(params: FetchUsersRequest) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.fetchUsers(params)
  });
}

// Custom hook with default pagination
export function useFetchAllUsersWithPagination(
  page: number = 1,
  limit: number = 10,
) {
  return useFetchAllUsers({ page, limit });
}
