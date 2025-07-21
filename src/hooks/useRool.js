import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxioseSecure from "./useAxioseSecure";

export const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxioseSecure();

  const {
    data: role = "",
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}/role`);
      return res.data.role;
    },
  });

  // এখানে isLoadingRole নামে রিটার্ন করো
  return { role, isLoadingRole: loading || isLoading, refetch };
};
