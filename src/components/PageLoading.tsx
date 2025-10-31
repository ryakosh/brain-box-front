import { Loader2 } from "lucide-react";

const PageLoading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full text-fg">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
};

export default PageLoading;
