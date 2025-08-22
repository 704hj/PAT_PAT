"use client";

import React, { forwardRef } from "react";

type TLayoutProps = {
  children: React.ReactNode;
};

const Layout = forwardRef<HTMLImageElement, TLayoutProps>(
  ({ children }, ref) => {
    return (
      <div className="relative w-full min-h-screen">
        <img
          ref={ref}
          src="/images/bg/lumi.png"
          alt="background"
          className="w-full h-auto min-h-screen object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full">{children}</div>
      </div>
    );
  }
);

Layout.displayName = "Layout"; // forwardRef 쓸 때 권장

export default Layout;
