import React, { useState } from 'react';
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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterDropIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Nature as NatureIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const Farms = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedTab, setSelectedTab] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmDialog, setShowFarmDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleFavorite = (farmId) => {
    setFavorites(prev => 
      prev.includes(farmId) 
        ? prev.filter(id => id !== farmId)
        : [...prev, farmId]
    );
  };

  const handleFarmClick = (farm) => {
    setSelectedFarm(farm);
    setShowFarmDialog(true);
  };

  const handleCloseDialog = () => {
    setShowFarmDialog(false);
    setSelectedFarm(null);
  };

  const farms = [
    {
      id: 1,
      name: 'Olive Grove Estate',
      location: 'Sfax, Tunisia',
      size: 25,
      price: 850000,
      originalPrice: 950000,
      type: 'Olive Farm',
      region: 'Sfax',
      rating: 4.8,
      reviews: 12,
      image: '/images/farms/olive-grove.jpg',
      description: 'Premium olive grove with mature trees, modern irrigation system, and processing facilities.',
      features: [
        'Mature olive trees (15-20 years)',
        'Automated drip irrigation system',
        'On-site olive oil processing',
        'Storage facilities',
        'Access to main road',
        'Water rights included'
      ],
      specifications: {
        'Soil Type': 'Clay loam',
        'Water Source': 'Well + Irrigation',
        'Access': 'Paved road',
        'Electricity': 'Available',
        'Buildings': 'Processing facility',
        'Fencing': 'Perimeter fenced'
      },
      highlights: ['Organic certified', 'High yield potential', 'Turnkey operation'],
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Date Palm Oasis',
      location: 'Gabès, Tunisia',
      size: 18,
      price: 650000,
      originalPrice: 720000,
      type: 'Date Farm',
      region: 'Gabès',
      rating: 4.9,
      reviews: 8,
      image: '/images/farms/date-palm.jpg',
      description: 'Beautiful date palm plantation with premium varieties and excellent water access.',
      features: [
        'Premium date palm varieties',
        'Natural spring water',
        'Shade house facilities',
        'Harvesting equipment',
        'Storage and packaging area',
        'Worker accommodation'
      ],
      specifications: {
        'Soil Type': 'Sandy loam',
        'Water Source': 'Natural spring',
        'Access': 'Dirt road',
        'Electricity': 'Available',
        'Buildings': 'Storage + Accommodation',
        'Fencing': 'Partial fencing'
      },
      highlights: ['Premium varieties', 'Natural water source', 'Ready to harvest'],
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: 'Cereal Farm Plains',
      location: 'Béja, Tunisia',
      size: 120,
      price: 1800000,
      originalPrice: 2000000,
      type: 'Cereal Farm',
      region: 'Béja',
      rating: 4.7,
      reviews: 15,
      image: '/images/farms/cereal-farm.jpg',
      description: 'Large-scale cereal farm with modern equipment and excellent soil quality.',
      features: [
        'Large arable land',
        'Modern farming equipment',
        'Grain storage silos',
        'Irrigation system',
        'Tractor and machinery',
        'Office and workshop'
      ],
      specifications: {
        'Soil Type': 'Rich loam',
        'Water Source': 'Irrigation network',
        'Access': 'Highway access',
        'Electricity': 'Available',
        'Buildings': 'Office + Workshop + Silos',
        'Fencing': 'Not required'
      },
      highlights: ['Large scale', 'Modern equipment', 'High productivity'],
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: 'Citrus Orchard',
      location: 'Nabeul, Tunisia',
      size: 12,
      price: 480000,
      originalPrice: 550000,
      type: 'Citrus Farm',
      region: 'Nabeul',
      rating: 4.6,
      reviews: 10,
      image: '/images/farms/citrus-orchard.jpg',
      description: 'Well-established citrus orchard with multiple varieties and excellent market access.',
      features: [
        'Multiple citrus varieties',
        'Drip irrigation system',
        'Frost protection system',
        'Packing house',
        'Cold storage',
        'Market access'
      ],
      specifications: {
        'Soil Type': 'Sandy clay',
        'Water Source': 'Irrigation',
        'Access': 'Paved road',
        'Electricity': 'Available',
        'Buildings': 'Packing house + Storage',
        'Fencing': 'Perimeter fenced'
      },
      highlights: ['Multiple varieties', 'Market ready', 'Protected cultivation'],
      inStock: true,
      featured: false
    },
    {
      id: 5,
      name: 'Vineyard Estate',
      location: 'Grombalia, Tunisia',
      size: 8,
      price: 320000,
      originalPrice: 380000,
      type: 'Vineyard',
      region: 'Grombalia',
      rating: 4.8,
      reviews: 6,
      image: '/images/farms/vineyard.jpg',
      description: 'Premium vineyard with wine-making facilities and tasting room.',
      features: [
        'Premium grape varieties',
        'Wine-making facility',
        'Tasting room',
        'Cellar storage',
        'Tourism potential',
        'Brand established'
      ],
      specifications: {
        'Soil Type': 'Limestone',
        'Water Source': 'Irrigation',
        'Access': 'Paved road',
        'Electricity': 'Available',
        'Buildings': 'Winery + Tasting room',
        'Fencing': 'Perimeter fenced'
      },
      highlights: ['Wine production', 'Tourism potential', 'Established brand'],
      inStock: false,
      featured: true
    },
    {
      id: 6,
      name: 'Mixed Fruit Farm',
      location: 'Zaghouan, Tunisia',
      size: 15,
      price: 580000,
      originalPrice: 620000,
      type: 'Mixed Fruit',
      region: 'Zaghouan',
      rating: 4.5,
      reviews: 9,
      image: '/images/farms/mixed-fruit.jpg',
      description: 'Diverse fruit farm with multiple varieties and year-round production.',
      features: [
        'Multiple fruit varieties',
        'Greenhouse facilities',
        'Irrigation system',
        'Packing facilities',
        'Cold storage',
        'Direct market access'
      ],
      specifications: {
        'Soil Type': 'Loamy',
        'Water Source': 'Irrigation',
        'Access': 'Paved road',
        'Electricity': 'Available',
        'Buildings': 'Packing house + Storage',
        'Fencing': 'Perimeter fenced'
      },
      highlights: ['Year-round production', 'Multiple varieties', 'Market access'],
      inStock: true,
      featured: false
    }
  ];

  const regions = ['All', 'Sfax', 'Gabès', 'Béja', 'Nabeul', 'Grombalia', 'Zaghouan'];
  const sizes = ['All', 'Small (5-15 ha)', 'Medium (15-50 ha)', 'Large (50+ ha)'];
  const prices = ['All', 'Under 500K TND', '500K-1M TND', 'Over 1M TND'];
  const tabs = ['All Farms', 'Featured', 'Olive Farms', 'Date Farms', 'Cereal Farms'];

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || farm.region === selectedRegion;
    const matchesSize = selectedSize === 'All' || 
                       (selectedSize === 'Small (5-15 ha)' && farm.size < 15) ||
                       (selectedSize === 'Medium (15-50 ha)' && farm.size >= 15 && farm.size < 50) ||
                       (selectedSize === 'Large (50+ ha)' && farm.size >= 50);
    const matchesPrice = selectedPrice === 'All' ||
                        (selectedPrice === 'Under 500K TND' && farm.price < 500000) ||
                        (selectedPrice === '500K-1M TND' && farm.price >= 500000 && farm.price < 1000000) ||
                        (selectedPrice === 'Over 1M TND' && farm.price >= 1000000);
    return matchesSearch && matchesRegion && matchesSize && matchesPrice;
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/farms-hero.jpg')`,
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
            Premium Farms for Sale
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Discover exceptional agricultural properties across Tunisia
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search farms by name or location..."
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
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={selectedRegion}
                  label="Region"
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedSize}
                  label="Size"
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Price</InputLabel>
                <Select
                  value={selectedPrice}
                  label="Price"
                  onChange={(e) => setSelectedPrice(e.target.value)}
                >
                  {prices.map((price) => (
                    <MenuItem key={price} value={price}>
                      {price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredFarms.length} farms found
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

        {/* Farm Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Box>

        {/* Farms Grid */}
        <Grid container spacing={4}>
          {filteredFarms.map((farm) => (
            <Grid item xs={12} lg={6} key={farm.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={farm.image}
                    alt={farm.name}
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
                      onClick={() => toggleFavorite(farm.id)}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': { backgroundColor: 'white' },
                      }}
                    >
                      <FavoriteIcon 
                        color={favorites.includes(farm.id) ? 'error' : 'action'} 
                        fontSize="small"
                      />
                    </IconButton>
                    {!farm.inStock && (
                      <Chip
                        label="Sold"
                        color="error"
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                      />
                    )}
                    {farm.featured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                      />
                    )}
                  </Box>
                  {farm.originalPrice > farm.price && (
                    <Chip
                      label={`${Math.round(((farm.originalPrice - farm.price) / farm.originalPrice) * 100)}% OFF`}
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'rgba(76, 175, 80, 0.9)',
                        color: 'white',
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>
                      {farm.name}
                    </Typography>
                    <Chip label={farm.type} size="small" color="primary" variant="outlined" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {farm.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AgricultureIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {farm.size} hectares
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>
                    {farm.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={farm.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({farm.reviews})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" color="secondary.main" fontWeight="bold">
                      {farm.price.toLocaleString()} TND
                    </Typography>
                    {farm.originalPrice > farm.price && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through', ml: 1 }}
                      >
                        {farm.originalPrice.toLocaleString()} TND
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    {farm.highlights.map((highlight, index) => (
                      <Chip
                        key={index}
                        label={highlight}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!farm.inStock}
                    onClick={() => handleFarmClick(farm)}
                    sx={{
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      py: 1.5,
                    }}
                  >
                    {farm.inStock ? 'View Details' : 'Sold'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Farm Details Dialog */}
        <Dialog 
          open={showFarmDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedFarm && (
            <>
              <DialogTitle>
                <Typography variant="h4">{selectedFarm.name}</Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedFarm.image}
                      alt={selectedFarm.name}
                      sx={{ objectFit: 'cover', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                      Farm Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Location" secondary={selectedFarm.location} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AgricultureIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Size" secondary={`${selectedFarm.size} hectares`} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <StarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Rating" secondary={`${selectedFarm.rating}/5 (${selectedFarm.reviews} reviews)`} />
                      </ListItem>
                    </List>

                    <Typography variant="h6" color="primary.main" sx={{ mb: 2, mt: 3 }}>
                      Key Features
                    </Typography>
                    <List dense>
                      {selectedFarm.features.map((feature, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                    Specifications
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(selectedFarm.specifications).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="primary.main">
                            {key}
                          </Typography>
                          <Typography variant="body2">
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => window.open(`tel:+21671234567`)}
                >
                  Call Now
                </Button>
                <Button
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => window.open(`https://wa.me/21698765432?text=I'm interested in ${selectedFarm.name}`)}
                >
                  WhatsApp
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Why Choose Our Farms Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'primary.main' }}>
            Why Choose Our Farms?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SecurityIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Verified Properties
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All farms are thoroughly inspected and verified for quality and legal compliance.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SupportIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Expert Guidance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional assistance throughout the buying process and post-purchase support.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <TrendingUpIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Investment Potential
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Farms selected for their growth potential and market opportunities.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <BusinessIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Turnkey Solutions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready-to-operate farms with equipment, infrastructure, and support included.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Farms; 