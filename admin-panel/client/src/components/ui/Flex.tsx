import type { PropsWithChildren } from "react";

const Flex: React.FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

export default Flex;
