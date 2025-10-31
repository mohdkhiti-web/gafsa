import React, { useCallback, useState } from 'react';
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

const createInitialFormState = () => ({
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
});

const AuthDialog = () => {
  const { isAuthDialogOpen, closeAuthDialog, login, register } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const [formData, setFormData] = useState(() => createInitialFormState());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (message, fallback) => {
    if (!message) {
      return fallback;
    }

    const genericMessages = ['Login failed.', 'Registration failed.'];
    return genericMessages.includes(message) ? fallback : message;
  };

  const handleClose = useCallback(() => {
    setFormData(createInitialFormState());
    setError('');
    setTab(0);
    closeAuthDialog();
  }, [closeAuthDialog]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 0) {
      // Login
      if (!formData.email || !formData.password) {
        setError(t('auth.fillAllFields'));
        return;
      }
      try {
        setIsSubmitting(true);
        await login(formData.email.trim(), formData.password);
        handleClose();
      } catch (err) {
        setError(getErrorMessage(err?.message, t('auth.loginError')));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Signup
      if (!formData.email || !formData.password || !formData.name || !formData.confirmPassword) {
        setError(t('auth.fillAllFields'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t('auth.passwordMismatch'));
        return;
      }
      try {
        setIsSubmitting(true);
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        handleClose();
      } catch (err) {
        setError(getErrorMessage(err?.message, t('auth.registerError')));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isAuthDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
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
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
          {tab === 0 ? t('auth.login') : t('auth.register')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog; 
