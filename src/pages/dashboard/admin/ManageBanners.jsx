import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageBanners() {
  const { data: ads = [], refetch } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await axios.get("/advertisements");
      // console.log(res.data); // ডাটা কেমন আসছে চেক করো
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const toggleSlide = async (id, inSlider) => {
    await axios.patch(`/advertisements/toggle-slide/${id}`, { inSlider: !inSlider });
    Swal.fire("Updated", "Slider status changed", "success");
    refetch();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Manage Advertisement Slider</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Seller</th>
              <th>Slider</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">No advertisements found.</td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad._id}>
                  <td><img src={ad.image} alt="" className="w-16" /></td>
                  <td>{ad.medicineName}</td>
                  <td>{ad.sellerEmail}</td>
                  <td>
                    <button onClick={() => toggleSlide(ad._id, ad.inSlider)} className="btn btn-sm">
                      {ad.inSlider ? "Remove" : "Add"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
