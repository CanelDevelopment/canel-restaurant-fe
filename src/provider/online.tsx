import { useUser } from "./user.provider";
import type { FC, ReactNode } from "react";

interface OnlineProps {
  fallback?: ReactNode;
  offline?: ReactNode | (() => ReactNode);
  children:
    | ((
        user: NonNullable<ReturnType<typeof useUser>["data"]>["user"]
      ) => ReactNode)
    | ReactNode;
}

export const Online: FC<OnlineProps> = ({
  fallback = "loading...",
  children,
  offline,
}) => {
  const { isLoading, data } = useUser();

  const user = data?.user;

  if (isLoading && !user) return <>{fallback}</>;
  else if (!isLoading && !user)
    return typeof offline === "function" ? offline() : offline;
  else
    return typeof children === "function" && user ? (
      <>{children(user)}</>
    ) : (
      <>{children as ReactNode}</>
    );
};
