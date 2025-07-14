import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";


const useRole = (email) => {
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading } = useQuery({
    queryKey: ["user-role", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${email}`);
      return res.data.role;
    },
  });

  return role;
};

export default useRole;
