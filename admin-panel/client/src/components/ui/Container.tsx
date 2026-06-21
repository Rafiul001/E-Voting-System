import type { PropsWithChildren } from "react";

const Container: React.FC<
  PropsWithChildren & { className?: string }
> = ({ children, className }) => {
  return <div className={`max-w-7xl mx-auto p-2 ${className}`}>{children}</div>;
};

export default Container;
