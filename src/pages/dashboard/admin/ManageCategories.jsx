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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

// MUI Theme colors using your palette
const palette = {
  primary: "#10b981", // Emerald Green
  secondary: "#3b82f6", // Blue
  error: "#ef4444",
  surface: "#ffffff",
  background: "#f9fafb",
  text: "#1f2937",
  muted: "#6b7280",
};

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
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  // Mutations
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory) => {
      const res = await axiosSecure.post("/categories", newCategory);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("✅ Success!", "New category added!", "success");
      handleClose();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updatedCategory }) => {
      const res = await axiosSecure.patch(`/categories/${id}`, updatedCategory);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("✅ Updated!", "Category updated successfully!", "success");
      handleClose();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("🗑 Deleted!", "Category removed!", "success");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: palette.primary,
      cancelButtonColor: "#d33",
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
    <Box sx={{ p: 4, backgroundColor: palette.background, minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color={palette.primary}>
          Manage Categories
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: palette.primary }}
          onClick={handleOpenAdd}
        >
          + Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: palette.primary }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>#</TableCell>
              <TableCell sx={{ color: "#fff" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff" }}>Category Name</TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat, index) => (
              <TableRow key={cat._id} sx={{ "&:hover": { backgroundColor: palette.surface } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={cat.image} alt={cat.categoryName} />
                </TableCell>
                <TableCell>{cat.categoryName}</TableCell>
                <TableCell align="center">
                  <IconButton
                    sx={{ color: palette.secondary }}
                    onClick={() => handleOpenEdit(cat)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{ color: palette.error }}
                    onClick={() => handleDelete(cat._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: palette.primary }}>
          {isEdit ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Category Name"
              variant="outlined"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Image URL"
              variant="outlined"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: palette.muted }}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} sx={{ backgroundColor: palette.primary, color: "#fff", "&:hover": { backgroundColor: "#0f9c70" } }}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCategories;
