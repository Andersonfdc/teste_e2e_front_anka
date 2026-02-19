import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Componente de spinner de loading animado
 */
export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary`}
      ></div>
    </div>
  );
}

/**
 * Componente de loading para formulários
 */
export function FormLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">
          Carregando formulário...
        </p>
        <p className="text-sm text-gray-500">Aguarde um momento</p>
      </div>
    </div>
  );
}

/**
 * Componente de loading para páginas
 */
export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Carregando página...
        </h2>
        <p className="text-gray-600">Preparando tudo para você</p>
      </div>
    </div>
  );
}

/**
 * Componente de loading para breadcrumbs
 */
export function BreadcrumbLoading() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/**
 * Componente de loading para tabelas com layout completo de página
 * Inclui breadcrumbs, título e botões de ação
 */
export function PageTableLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <BreadcrumbLoading />
      </div>

      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 px-6 py-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>

        {/* Table body */}
        <div className="bg-white">
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="border-b border-gray-100 last:border-b-0"
            >
              <div className="grid grid-cols-4 gap-4 px-6 py-4">
                {[...Array(4)].map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-6 py-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de loading para tabelas (versão simplificada)
 */
export function TableLoading() {
  return (
    <div className="space-y-4">
      {/* Table skeleton */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 px-6 py-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>

        {/* Table body */}
        <div className="bg-white">
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="border-b border-gray-100 last:border-b-0"
            >
              <div className="grid grid-cols-4 gap-4 px-6 py-4">
                {[...Array(4)].map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-6 py-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de loading para cards
 */
export function CardLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de loading para formulários de operações
 */
export function OperationFormLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Carregando formulário de operação...
        </h2>
        <p className="text-gray-600">Preparando campos e validações</p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 col-span-2" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 col-span-2" />
        <Skeleton className="h-10 col-span-2" />
      </div>
    </div>
  );
}

/**
 * Componente de loading para listas de operações
 */
export function OperationsListLoading() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Operations grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente de fallback para botões de ação
 */
export function ActionButtonSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-10" />
    </div>
  );
}

/**
 * Componente de fallback para botão único
 */
export function SingleButtonSkeleton({ width = "w-32" }: { width?: string }) {
  return <Skeleton className={`h-10 ${width}`} />;
}

/**
 * Componente de fallback para botão de ícone
 */
export function IconButtonSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-md" />;
}

/**
 * Componente de fallback para grupo de botões
 */
export function ButtonGroupSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="flex items-center gap-2">
      {[...Array(count)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-24" />
      ))}
    </div>
  );
}

/**
 * Componente de fallback para botões de toolbar
 */
export function ToolbarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-10" />
    </div>
  );
}
