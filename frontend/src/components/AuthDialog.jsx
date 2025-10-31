import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  Link,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AuthDialog = () => {
  const { isAuthDialogOpen, closeAuthDialog, login } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tab === 0) {
      // Login
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      login(formData.email, formData.password);
      closeAuthDialog();
    } else {
      // Signup
      if (!formData.email || !formData.password || !formData.name || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Handle signup logic here
      console.log('Signup data:', formData);
      closeAuthDialog();
    }
  };

  return (
    <Dialog open={isAuthDialogOpen} onClose={closeAuthDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('auth.login')} />
          <Tab label={t('auth.register')} />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {tab === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('auth.name')}
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label={t('auth.email')}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            autoComplete={tab === 0 ? 'current-password' : 'new-password'}
            value={formData.password}
            onChange={handleInputChange}
          />
          {tab === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('auth.confirmPassword')}
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          )}
          {tab === 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link href="#" variant="body2">
                {t('auth.forgotPassword')}
              </Link>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAuthDialog}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {tab === 0 ? t('auth.login') : t('auth.register')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog; 