import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  useTheme,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Landscape as LandsIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { apiService } from '../services/api';
import ImageUpload from '../components/ImageUpload';

const Lands = () => {
  const theme = useTheme();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    type: '',
    price: '',
    status: 'available',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const response = await apiService.lands.getAll();
      setLands(response.data);
    } catch (error) {
      console.error('Error fetching lands:', error);
      setSnackbar({ open: true, message: 'Error fetching lands', severity: 'error' });
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (land = null) => {
    if (land) {
      setSelectedLand(land);
      setFormData({
        name: land.name,
        location: land.location,
        size: land.size,
        type: land.type,
        price: land.price,
        status: land.status,
        description: land.description,
        imageUrl: land.imageUrl || '',
      });
    } else {
      setSelectedLand(null);
      setFormData({
        name: '',
        location: '',
        size: '',
        type: '',
        price: '',
        status: 'available',
        description: '',
        imageUrl: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLand(null);
    setFormData({
      name: '',
      location: '',
      size: '',
      type: '',
      price: '',
      status: 'available',
      description: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedLand) {
        await apiService.lands.update(selectedLand.id, formData);
        setSnackbar({ open: true, message: 'Land updated successfully!', severity: 'success' });
      } else {
        await apiService.lands.create(formData);
        setSnackbar({ open: true, message: 'Land created successfully!', severity: 'success' });
      }
      fetchLands();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving land:', error);
      const errorMessage = error.response?.data?.message || 'Error saving land';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDelete = async (landId) => {
    if (window.confirm('Are you sure you want to delete this land?')) {
      try {
        await apiService.lands.delete(landId);
        setSnackbar({ open: true, message: 'Land deleted successfully!', severity: 'success' });
        fetchLands();
      } catch (error) {
        console.error('Error deleting land:', error);
        const errorMessage = error.response?.data?.message || 'Error deleting land';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Land Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {params.row.id}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value} hectares
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value.toLocaleString()} TND
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'available' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const landTypes = [
    'Arable',
    'Orchard',
    'Vineyard',
    'Mixed',
    'Greenhouse',
    'Pasture',
    'Forest',
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Land Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Add Land
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={lands}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Land Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedLand ? 'Edit Land' : 'Add New Land'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Land Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{ mb: 3 }}
            >
              {landTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              sx={{ mb: 3 }}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="leased">Leased</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 3 }}
            />
            <ImageUpload
              value={formData.imageUrl}
              onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
              label="Land Image"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {selectedLand ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Lands; 