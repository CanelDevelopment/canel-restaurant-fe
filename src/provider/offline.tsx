import type { FC, PropsWithChildren, ReactNode } from "react";
import { useUser } from "./user.provider";


interface OfflineProps extends PropsWithChildren {
  fallback?: ReactNode;
  online?:
    | ReactNode
    | ((
        user: NonNullable<ReturnType<typeof useUser>["data"]>["user"]
      ) => ReactNode);
}



/**
 * 
 * Used for signed out components
 */
export const Offline: FC<OfflineProps> = ({
  fallback = "loading...",
  children,
  online,
}) => {
  const { isLoading, data } = useUser();
  const user = data?.user;
  if (isLoading && !user) return <>{fallback}</>;
  else if (!isLoading && user)
    return typeof online === "function" ? online(user) : online;
  else return <>{children}</>;
};
