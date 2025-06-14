export default ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/20">
      {children}
    </span>
  );
};
