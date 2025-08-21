"use client";

type TLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: TLayoutProps) {
  return (
    <div className="relative w-full min-h-screen">
      <img
        src="/images/bg/image1.png"
        alt="background"
        className="w-full h-auto min-h-screen object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full">{children}</div>
    </div>
  );
}
