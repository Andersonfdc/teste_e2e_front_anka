"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { UserInactivationDialog, UserActivationDialog } from "@/components/users";
// Removed form components to avoid requiring react-hook-form context
import { AccountCircleOutlined, EditOutlined, NoAccountsOutlined } from "@mui/icons-material";
import { User, UserRole, UserRoleNames } from "@/types/user";
import { useToggleUserStatus } from "@/hooks/users/use-toggle-user-status";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useChangeUserRole } from "@/hooks/users/use-change-user-role";
import { Label } from "@/components/ui/label";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  user: User;
  onUserUpdated?: () => void; // Callback to refresh user list
}

/**
 * UserDetailsSheet component
 * Displays user information and allows editing in a sheet format
 * 
 * @param open - boolean to control the open state of the sheet
 * @param onOpenChange - function to handle the open state change
 * @param user - User object containing user information
 * @param onUserUpdated - Callback to refresh the user list after update
 */
export function UserDetailsSheet({ open, onOpenChange, onClose, user, onUserUpdated }: UserDetailsSheetProps) {
  const [inactivationDialogOpen, setInactivationDialogOpen] = React.useState(false);
  const [activationDialogOpen, setActivationDialogOpen] = React.useState(false);
  const [currentIsActive, setCurrentIsActive] = React.useState(user.isActive);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState(user.role);

  const changeRole = useChangeUserRole();
  const toggleStatus = useToggleUserStatus();

  // Handle user inactivation - only changes form state
  const handleInactivateUser = async () => {
    try {
      setIsSubmitting(true);
      await toggleStatus.mutateAsync({ userId: user.id });
      setCurrentIsActive(false);
      toast.success("Usuário inativado com sucesso!");
      onUserUpdated?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Erro ao inativar usuário");
    } finally {
      setIsSubmitting(false);
      setInactivationDialogOpen(false);
    }
  };

  // Handle user activation - only changes form state
  const handleActivateUser = async () => {
    try {
      setIsSubmitting(true);
      await toggleStatus.mutateAsync({ userId: user.id });
      setCurrentIsActive(true);
      toast.success("Usuário ativado com sucesso!");
      onUserUpdated?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Erro ao ativar usuário");
    } finally {
      setIsSubmitting(false);
      setActivationDialogOpen(false);
    }
  };

  // Handle cancel - reset form to original values and close sheet
  const handleCancel = () => {
    onOpenChange(false);
    onClose();
  };

  // Sync local state when user prop changes (when opening for different user)
  React.useEffect(() => {
    setCurrentIsActive(user.isActive);
    setCurrentRole(user.role);
  }, [user]);

  const hasRoleChange = currentRole !== user.role;

  return (
    <Sheet 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <SheetContent className="!p-0" aria-describedby="user-details-sheet-description">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle>Detalhes do Usuário</SheetTitle>
          <SheetDescription id="user-details-sheet-description" className="sr-only">
            Visualize e gerencie os detalhes do usuário
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-6 pb-4">
              {/* Status Badge */}
              <Badge variant={currentIsActive ? "default" : "destructive"}>
                {currentIsActive ? "Ativo" : "Inativo"}
              </Badge>

              {/* User Information Section */}
              <div className="space-y-6">
                {/* Nome Completo */}
                <div>
                  <Label>Nome completo</Label>
                  <Input 
                    value={user.name}
                    placeholder="Nome completo"
                    disabled
                    readOnly
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={user.email}
                    placeholder="Email"
                    disabled
                    readOnly
                  />
                </div>

                {/* Função */}
                <div>
                  <Label>Função</Label>
                  <Select
                    value={currentRole}
                    onValueChange={(val) => setCurrentRole(val as UserRole)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {UserRoleNames[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Divider */}
              <Separator />

              {/* Operations section removed */}
            </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t bg-background">
          <div className="p-4">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 md:flex-nowrap">
              <Button 
                type="button"
                variant="ghost"
                size="lg"
                className="cursor-pointer"
                onClick={() => changeRole.mutateAsync({ userId: user.id, newRole: currentRole })}
                disabled={changeRole.isPending || !hasRoleChange}
              >
                <EditOutlined />
                Alterar função
              </Button>
              <div className="flex gap-2">
                {currentIsActive ? (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="lg" 
                    className="cursor-pointer text-destructive hover:text-destructive/90"
                    onClick={() => setInactivationDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    <NoAccountsOutlined />
                    Inativar usuário
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="lg" 
                    className="cursor-pointer text-[#06B80C] hover:text-[#06B80C]/90"
                    onClick={() => setActivationDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    <AccountCircleOutlined />
                    Ativar usuário
                  </Button>
                )}
              </div>
              <div className="flex justify-end md:ml-auto">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="cursor-pointer"
                  size="lg" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User Inactivation Dialog */}
        {inactivationDialogOpen && (
          <UserInactivationDialog
            open={inactivationDialogOpen}
            onOpenChange={setInactivationDialogOpen}
            onConfirm={handleInactivateUser}
          />
        )}
        {/* User Activation Dialog */}
        {activationDialogOpen && (
          <UserActivationDialog
            open={activationDialogOpen}
            onOpenChange={setActivationDialogOpen}
            onConfirm={handleActivateUser}
          />
        )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
