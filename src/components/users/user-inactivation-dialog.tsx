"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface UserInactivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function UserInactivationDialog({ open, onOpenChange, onConfirm }: UserInactivationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent aria-describedby="user-inactivation-dialog-description">
        <AlertDialogHeader>
          <AlertDialogTitle>Inativar usuário</AlertDialogTitle>
          <AlertDialogDescription id="user-inactivation-dialog-description">
            Tem certeza que deseja inativar este usuário? Ele perderá o acesso imediatamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Inativar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


