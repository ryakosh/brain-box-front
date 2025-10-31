const PageError = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-full w-full font-bold text-accent-red text-2xl">
      {children}
    </div>
  );
};

export default PageError;
