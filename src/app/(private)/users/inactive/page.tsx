"use client";

import React, { Suspense } from "react";
import type { User } from "@/types/user";
import { useFetchAllUsersWithPagination } from "@/hooks/users/use-fetch-all-users";
import { UserDataTable } from "../_components/user-data-table";
import { UserDetailsSheet } from "../_components/user-details-sheet";
import { UserEditSheet } from "../_components/user-edit-sheet";
import { TableLoading } from "@/components/ui/loading";

function UsersInactiveContent() {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [page] = React.useState(1);
  const [limit] = React.useState(10);

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchAllUsersWithPagination(page, limit);

  const allUsers = usersResponse?.data || [];
  const users = allUsers.filter((u) => u.isActive === false);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleUserUpdated = () => {
    refetch();
  };

  if (isError) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar usuários</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Ocorreu um erro inesperado"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <UserDataTable data={users} isLoading={isLoading} onViewDetails={handleViewDetails} onEditUser={handleEditUser} />

      {selectedUser && (
        <UserDetailsSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {selectedUser && (
        <UserEditSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
    </div>
  );
}

export default function UsersInactivePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-8 py-8"><TableLoading /></div>}>
      <UsersInactiveContent />
    </Suspense>
  );
}


