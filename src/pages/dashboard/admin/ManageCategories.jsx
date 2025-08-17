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
      Swal.fire("✅ Success!", "New category added!", "success");
      handleClose();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updatedCategory }) =>
      axiosSecure.patch(`/categories/${id}`, updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("✅ Updated!", "Category updated successfully!", "success");
      handleClose();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/categories/${id}`),
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
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "var(--color-muted)",
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
    <Box
      sx={{
        p: 4,
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        minHeight: "100vh",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="var(--color-primary)">
          Manage Categories
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          onClick={handleOpenAdd}
        >
          + Add Category
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "var(--color-primary)" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>#</TableCell>
              <TableCell sx={{ color: "#fff" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff" }}>Category Name</TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat, index) => (
              <TableRow
                key={cat._id}
                sx={{
                  "&:hover": { backgroundColor: "var(--color-bg)" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={cat.image} alt={cat.categoryName} />
                </TableCell>
                <TableCell>{cat.categoryName}</TableCell>
                <TableCell align="center">
                  <IconButton
                    sx={{ color: "var(--color-secondary)" }}
                    onClick={() => handleOpenEdit(cat)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{ color: "var(--color-error)" }}
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
        <DialogTitle sx={{ color: "var(--color-primary)" }}>
          {isEdit ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Category Name"
              variant="outlined"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              required
              fullWidth
              InputProps={{
                style: {
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface)",
                },
              }}
            />
            <TextField
              label="Image URL"
              variant="outlined"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              fullWidth
              InputProps={{
                style: {
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "var(--color-muted)" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
              "&:hover": { backgroundColor: "#0f9c70" },
            }}
          >
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCategories;
