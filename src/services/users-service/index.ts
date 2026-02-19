import { AxiosInstance } from 'axios';
import api from '../api';
import type {
  FetchUsersRequest,
  FetchUsersResponse,
  EditUserRequest,
  EditUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  ChangeUserRoleResponse,
  ToggleUserStatusResponse,
} from './types';
import { HandleApiErrors } from '../api/error-decorator';
import { UserRole } from '@/types/user';

class UsersService {
  constructor(private readonly api: AxiosInstance) {}

  @HandleApiErrors
  async fetchUsers({ page, limit }: FetchUsersRequest): Promise<FetchUsersResponse> {
    const response = await this.api.get('/users/', {
      params: { page, limit },
    });
    return response.data;
  }

  @HandleApiErrors
  async editUser(userId: string, data: EditUserRequest): Promise<EditUserResponse> {
    const response = await this.api.post(`/users/${userId}/edit`, data);
    return response.data;
  }

  @HandleApiErrors
  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await this.api.post('/users', payload);
    return response.data;
  }

  @HandleApiErrors
  async changeUserRole(userId: string, newRole: UserRole): Promise<ChangeUserRoleResponse> {
    const response = await this.api.post(`/users/${userId}/edit/change-role`, { newRole });
    return response.data;
  }

  @HandleApiErrors
  async toggleUserStatus(userId: string): Promise<ToggleUserStatusResponse> {
    const response = await this.api.post(`/users/${userId}/edit/toggle-status`);
    return response.data;
  }
}

const usersService = new UsersService(api);

export default usersService;
