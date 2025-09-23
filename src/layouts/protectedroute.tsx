import { Navigate } from "react-router-dom";
import { authClient } from "@/provider/user.provider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!data?.session?.token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

// Only for public pages like /signin
export const PublicOnlyRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isPending } = authClient.useSession();

  if (isPending) return null;

  if (data?.session?.token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
