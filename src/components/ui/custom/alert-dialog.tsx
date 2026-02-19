"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WarningAmberOutlined } from '@mui/icons-material';

// Types for the custom alert dialog
export interface CustomAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  body?: React.ReactNode; // Optional custom body content
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Variant styles for different types of alerts
const variantStyles = {
  default: {
    confirmButton: "bg-primary hover:bg-primary/90",
    title: "text-slate-800",
    description: "text-slate-600"
  },
  destructive: {
    confirmButton: "bg-destructive hover:bg-destructive/90 text-white",
    title: "text-destructive",
    description: "text-slate-600"
  },
  warning: {
    confirmButton: "bg-amber-600 hover:bg-amber-600/90 text-white",
    title: "text-amber-600",
    description: "text-slate-600"
  }
};

/**
 * CustomAlertDialog component
 * A reusable alert dialog for confirmation actions
 * 
 * @param open - boolean to control the open state
 * @param onOpenChange - function to handle open state changes
 * @param title - dialog title
 * @param description - dialog description
 * @param body - optional custom body content (ReactNode) placed between description and footer
 * @param confirmText - text for confirm button (default: "Confirmar")
 * @param cancelText - text for cancel button (default: "Cancelar")
 * @param variant - visual variant (default, destructive, warning)
 * @param onConfirm - function called when confirmed
 * @param onCancel - optional function called when cancelled
 * @param isLoading - shows loading state on confirm button
 * @param disabled - disables the dialog actions
 */
export function CustomAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  body,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
  disabled = false
}: CustomAlertDialogProps) {
  const handleConfirm = () => {
    if (!disabled && !isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      onCancel?.();
      onOpenChange(false);
    }
  };

  const styles = variantStyles[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="!w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("text-center !text-xl font-semibold", styles.title)}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center">
              <WarningAmberOutlined className="text-primary" />
              <span>{title}</span>
            </div>
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className={cn("text-sm", styles.description)}>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        
        {/* Optional custom body content */}
        {body && (
          <div className="px-6 py-4 border-t border-gray-200">
            {body}
          </div>
        )}
        
        <AlertDialogFooter className="flex-col !justify-center gap-3">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            className={cn(
              styles.confirmButton, 
              "cursor-pointer"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-configured alert dialogs for common use cases
export function UserInactivationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Inativar este usuário?"
      confirmText="Inativar"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function UserActivationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ativar este usuário?"
      confirmText="Ativar"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function TrancheDeletionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir tranche?"
      confirmText="Excluir"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function ConditionDeletionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir condição?"
      confirmText="Excluir"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function ConciliateCancelDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancelar conciliação?"
      description="Todas as transferências selecionadas serão perdidas. Deseja continuar?"
      confirmText="Cancelar conciliação"
      cancelText="Voltar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function CancelContractCreationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancelar criação do contrato?"
      description="Todos os dados inseridos serão perdidos. Deseja continuar?"
      confirmText="Cancelar criação"
      cancelText="Continuar editando"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function CancelContractEditionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancelar edição do contrato?"
      description="Todas as alterações não salvas serão perdidas. Deseja continuar?"
      confirmText="Cancelar edição"
      cancelText="Continuar editando"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function DeleteInstallmentsGroupDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  totalInstallments,
  totalPaidInstallments
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  totalInstallments: number;
  totalPaidInstallments: number;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar grupo de recebíveis?"
      body={
        <div className="text-sm text-gray-600">
          <p><strong>Esta ação não pode ser desfeita.</strong></p>
          <br />
          <p>Todos os recebíveis (<strong>total:</strong> {totalInstallments}, <strong>pagos:</strong> {totalPaidInstallments}) e conciliações relacionadas serão excluídas permanentemente.</p>
        </div>
      }
      confirmText="Deletar grupo"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}

export function DocumentDeletionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <CustomAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir documento?"
      confirmText="Excluir"
      cancelText="Cancelar"
      variant="default"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}