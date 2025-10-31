import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { apiService } from '../services/api';

const ImageUpload = ({
  value,
  onChange,
  label = "Upload Image",
  accept = "image/*",
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  /* Ancien fonction */

/*   const handleFile = async (file) => {
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.uploadImage(formData);
      if (response?.url) {
        onChange(response.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }; */


  /* Nouvelle fonction pour gérer les differentes type de rép  */
  const handleFile = async (file) => {
  setError('');
  setUploading(true);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiService.uploadImage(formData);
    
    // Si la rép est l'URL
    if (typeof response === 'string') {
      onChange(response);
    } 
    // Si la rép contient une prop url
    else if (response?.url) {
      onChange(response.url);
    }
    // Si la réponse contient une prop # (comme 'path', 'imageUrl', etc.)
    else if (response?.path) {
      onChange(response.path);
    }
    else if (response?.imageUrl) {
      onChange(response.imageUrl);
    }
    // Si la réponse contient data dans 'data'
    else if (response?.data?.url) {
      onChange(response.data.url);
    }
    else {
      console.log('Réponse complète du serveur:', response);
      throw new Error('Format de réponse non reconnu');
    }
  } catch (err) {
    console.error('Image upload error:', err);
    setError(err.response?.data?.message || err.message || 'Failed to upload image');
  } finally {
    setUploading(false);
  }
};
  
  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}${path}`;
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
          backgroundColor: dragActive ? '#f3f8ff' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: disabled ? '#e0e0e0' : '#1976d2',
            backgroundColor: disabled ? 'transparent' : '#f3f8ff',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {value ? (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={getImageUrl(value)}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              {!disabled && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Click to change image
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {uploading ? (
              <Box>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading image...
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Drag & drop an image here, or click to select
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports all image formats and sizes
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;