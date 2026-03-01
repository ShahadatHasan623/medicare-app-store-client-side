import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Typography,
  Tooltip,
  Zoom,
} from "@mui/material";
import { Edit, Delete, CategoryRounded } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

const ManageCategories = () => {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ categoryName: "", image: "" });

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosSecure.get("/categories")).data,
  });

  // Mutations
  const addCategoryMutation = useMutation({
    mutationFn: (newCategory) => axiosSecure.post("/categories", newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire({ icon: "success", title: "Success!", text: "New category added!", timer: 1500, showConfirmButton: false });
      handleClose();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updatedCategory }) =>
      axiosSecure.patch(`/categories/${id}`, updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire({ icon: "success", title: "Updated!", text: "Category updated successfully!", timer: 1500, showConfirmButton: false });
      handleClose();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire({ icon: "success", title: "Deleted!", text: "Category removed!", timer: 1500, showConfirmButton: false });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteCategoryMutation.mutate(id);
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({ categoryName: "", image: "" });
    setOpen(true);
  };

  const handleOpenEdit = (category) => {
    setIsEdit(true);
    setCurrentId(category._id);
    setFormData({ categoryName: category.categoryName, image: category.image });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateCategoryMutation.mutate({ id: currentId, updatedCategory: formData });
    } else {
      addCategoryMutation.mutate(formData);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.05)",
          backgroundColor: "var(--color-surface)",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "var(--color-primary)", width: 50, height: 50 }}>
            <CategoryRounded />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="800" color="var(--color-primary)">
              Category Management
            </Typography>
            <Typography variant="body2" color="var(--color-muted)">
              Manage and organize your product categories
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleOpenAdd}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "var(--color-primary)",
            "&:hover": { backgroundColor: "var(--color-primary)", opacity: 0.9, transform: "translateY(-2px)" },
            transition: "all 0.3s ease",
            boxShadow: "0 10px 20px -10px var(--color-primary)"
          }}
        >
          Add Category
        </Button>
      </Paper>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          backgroundColor: "var(--color-surface)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-primary)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", py: 2.5 }}>SL</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Preview</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Category Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat, index) => (
              <TableRow
                key={cat._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                  transition: "background 0.2s"
                }}
              >
                <TableCell sx={{ fontWeight: "500", color: "var(--color-muted)" }}>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={cat.image}
                    alt={cat.categoryName}
                    variant="rounded"
                    sx={{ width: 48, height: 48, borderRadius: "12px", border: "1px solid #eee" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="600" color="var(--color-text)">
                    {cat.categoryName}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Edit Category" TransitionComponent={Zoom}>
                      <IconButton
                        onClick={() => handleOpenEdit(cat)}
                        sx={{
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          color: "var(--color-secondary)",
                          "&:hover": { backgroundColor: "var(--color-secondary)", color: "#fff" }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category" TransitionComponent={Zoom}>
                      <IconButton
                        onClick={() => handleDelete(cat._id)}
                        sx={{
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          color: "var(--color-error)",
                          "&:hover": { backgroundColor: "var(--color-error)", color: "#fff" }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modern Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "24px", p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: "800", color: "var(--color-primary)", pt: 3 }}>
          {isEdit ? "Update Category" : "Create Category"}
          <Typography variant="body2" color="var(--color-muted)" fontWeight="normal">
            {isEdit ? "Modify existing category details" : "Setup a new category for products"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, py: 1 }}>
            <TextField
              label="Category Name"
              placeholder="e.g. Tablets"
              variant="filled"
              fullWidth
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              InputProps={{ disableUnderline: true, sx: { borderRadius: "12px" } }}
            />
            <TextField
              label="Image URL"
              placeholder="https://image-link.com"
              variant="filled"
              fullWidth
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              InputProps={{ disableUnderline: true, sx: { borderRadius: "12px" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{ color: "var(--color-muted)", fontWeight: "bold", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
              borderRadius: "12px",
              px: 4,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "var(--color-primary)", opacity: 0.9 }
            }}
          >
            {isEdit ? "Save Changes" : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCategories;