import { Logo } from "@/components/Logo";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Logo />
      {children}
    </div>
  );
};

export default page;
