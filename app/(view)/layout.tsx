"use client";

type TLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: TLayoutProps) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(/images/bg/bg1.png)` }}
    >
      {children}
    </div>
  );
}
