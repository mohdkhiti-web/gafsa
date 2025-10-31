import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Agriculture as AgricultureIcon,
  LocalFlorist as FloristIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  ContactSupport as ContactIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, openAuthDialog, logout } = useAuth();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: t('navbar.home'), icon: <HomeIcon />, path: '/' },
    { text: t('navbar.products'), icon: <AgricultureIcon />, path: '/products' },
    { text: t('navbar.services'), icon: <FloristIcon />, path: '/services' },
    { text: t('navbar.farms'), icon: <BusinessIcon />, path: '/farms' },
    { text: t('navbar.cart'), icon: <CartIcon />, path: '/cart' },
    { text: t('navbar.contact'), icon: <ContactIcon />, path: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '40',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile ? (
            <>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : null}

          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
          >
            <AgricultureIcon sx={{ fontSize: 32 }} />
            InvestFarm
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light + '20',
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: theme.palette.primary.light + '40',
                    }),
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  startIcon={<PersonIcon />}
                  onClick={logout}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {t('navbar.logout')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PersonIcon />}
                  onClick={openAuthDialog}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {t('navbar.login')}
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 