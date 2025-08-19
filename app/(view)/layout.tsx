"use client";

type TLayoutProps = {
  children: React.ReactNode;
};
export default function Layout({ children }: TLayoutProps) {
  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-auto">
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(/images/bg/image.png)` }}
      >
        {children}
      </div>
    </div>
  );
}
