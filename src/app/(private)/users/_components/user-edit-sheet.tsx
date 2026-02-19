"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { User, UserRole, UserRoleNames } from "@/types/user";
import { useEditUser } from "@/hooks/users/use-edit-user";

interface UserEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  user: User;
}

export function UserEditSheet({ open, onOpenChange, onClose, user }: UserEditSheetProps) {
  const { form, hasChanges, buildSubmitHandler, mutationResult } = useEditUser(user);
  const onSubmit = buildSubmitHandler({ onOpenChange, onClose });
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!p-0" aria-describedby="user-edit-sheet-description">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle>Editar Usuário</SheetTitle>
          <SheetDescription id="user-edit-sheet-description" className="sr-only">
            Edite os dados do usuário
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4">
            <Form {...form}>
              <div className="space-y-6 pb-4">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Nome é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Digite o email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    rules={{ required: "Função é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(UserRole).map((func) => (
                              <SelectItem key={func} value={func}>
                                {UserRoleNames[func]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(val === "active")}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => {
                      onOpenChange(false);
                      onClose();
                    }}
                    disabled={mutationResult.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" className="cursor-pointer" onClick={handleSubmit} disabled={!hasChanges || mutationResult.isPending}>
                    {mutationResult.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


