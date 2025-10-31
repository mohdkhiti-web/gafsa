import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Badge,
  IconButton,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';

const Products = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTab, setSelectedTab] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const equipmentData = await apiService.equipment.getAll();
      setEquipment(equipmentData);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  
const getImageUrl = (path) => {
  if (!path) return '/images/products/default.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    const baseUrl = 'http://localhost:3002';
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }
  return path;
};

  // Transform equipment data to products format
  const products = equipment.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || 'High-quality agricultural equipment for modern farming.',
    //image: item.imageUrl || '/images/products/default.jpg',
    image: item.imageUrl ? getImageUrl(item.imageUrl) : '/images/products/default.jpg',
    price: item.price,
    originalPrice: item.price * 1.2, // Add 20% markup for original price
    category: item.type,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 50,
    inStock: item.status === 'AVAILABLE',
    features: [
      'High-quality materials',
      'Durable construction',
      'Easy to use',
      'Professional grade',
      'Warranty included'
    ],
    specifications: item.specifications ? (() => {
      try {
        return JSON.parse(item.specifications);
      } catch (e) {
        console.warn('Failed to parse specifications:', e);
        return {
          'Material': 'Steel',
          'Weight': 'Variable',
          'Power': 'Standard',
          'Warranty': '1 year'
        };
      }
    })() : {
      'Material': 'Steel',
      'Weight': 'Variable',
      'Power': 'Standard',
      'Warranty': '1 year'
    }
  }));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };



  // Get unique categories from equipment data
  const categories = ['All', ...new Set(equipment.map(item => item.type))];
  const tabs = [t('products.tabs.all'), t('products.tabs.featured'), t('products.tabs.new'), t('products.tabs.bestsellers')];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchEquipment}>
          {t('common.retry')}
        </Button>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
            {t('products.noProducts')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('products.noProductsSubtitle')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/products-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {t('products.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {t('products.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder={t('products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('products.category')}</InputLabel>
                <Select
                  value={selectedCategory}
                  label={t('products.category')}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('products.found', { count: filteredProducts.length })}
                </Typography>
                <IconButton>
                  <Badge badgeContent={favorites.length} color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Product Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => toggleFavorite(product.id)}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                      }}
                    >
                      <FavoriteIcon
                        sx={{
                          color: favorites.includes(product.id) ? 'error.main' : 'grey.500',
                        }}
                      />
                    </IconButton>
                    {!product.inStock && (
                      <Chip
                        label={t('products.outOfStock')}
                        size="small"
                        color="error"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                      />
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {product.price} TND
                      </Typography>
                      {product.originalPrice > product.price && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {product.originalPrice} TND
                        </Typography>
                      )}
                    </Box>
                    <Chip label={product.category} size="small" color="primary" variant="outlined" />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CartIcon />}
                    disabled={!product.inStock}
                    sx={{
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Our Products Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: 'primary.main' }}>
            {t('products.whyChoose.title')}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('products.whyChoose.quality.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('products.whyChoose.quality.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <SupportIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('products.whyChoose.support.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('products.whyChoose.support.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('products.whyChoose.innovation.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('products.whyChoose.innovation.description')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Products;