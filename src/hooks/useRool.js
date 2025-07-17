import { useQuery } from "@tanstack/react-query";
import  useAuth  from "./useAuth";
import useAxioseSecure from "./useAxioseSecure";

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxioseSecure();

  const {
    data: role = "",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}/role`);
      console.log(res);
      return res.data.role;
    },
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};