import { Spinner } from "@shadcn/shadcn-io/spinner";

export const Loader = () => {
  return (
    <div
      data-testid="loader"
      className="min-h-svh min-w-svw bg-white absolute left-0 top-0 flex items-center justify-center"
    >
      <Spinner size={64} variant="bars" className="text-primary" />
    </div>
  );
};
