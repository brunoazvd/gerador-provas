import { Spinner } from "@shadcn/shadcn-io/spinner";

export const Loader = () => {
  return (
    <div className="min-h-svh min-w-svw bg-white absolute left-0 top-0 flex items-center justify-center">
      <Spinner size={128} variant="bars" color="primary" />
    </div>
  );
};
