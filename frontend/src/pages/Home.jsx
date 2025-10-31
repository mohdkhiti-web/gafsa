import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Paper,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  LocalFlorist as LocalFloristIcon,
  Nature as NatureIcon,
  TrendingUp as TrendingUpIcon,
  WaterDrop as WaterDropIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    farmers: 0,
    hectares: 0,
    savings: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const targetStats = {
      farmers: 2500,
      hectares: 15000,
      savings: 40,
      satisfaction: 98,
    };

    const animateStats = () => {
      setStats(prev => ({
        farmers: Math.min(prev.farmers + 50, targetStats.farmers),
        hectares: Math.min(prev.hectares + 300, targetStats.hectares),
        savings: Math.min(prev.savings + 2, targetStats.savings),
        satisfaction: Math.min(prev.satisfaction + 2, targetStats.satisfaction),
      }));
    };

    const interval = setInterval(animateStats, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 50 }} />,
      title: t('home.features.smartFarming.title'),
      description: t('home.features.smartFarming.description'),
      color: 'primary.main',
    },
    {
      icon: <WaterDropIcon sx={{ fontSize: 50 }} />,
      title: t('home.features.waterConservation.title'),
      description: t('home.features.waterConservation.description'),
      color: 'info.main',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 50 }} />,
      title: t('home.features.dataAnalytics.title'),
      description: t('home.features.dataAnalytics.description'),
      color: 'secondary.main',
    },
    {
      icon: <NatureIcon sx={{ fontSize: 50 }} />,
      title: t('home.features.sustainablePractices.title'),
      description: t('home.features.sustainablePractices.description'),
      color: 'success.main',
    },
  ];

  const services = [
    {
      title: t('home.services.smartIrrigation.title'),
      description: t('home.services.smartIrrigation.description'),
      price: t('home.services.smartIrrigation.price'),
      image: '/images/services/irrigation.jpg',
    },
    {
      title: t('home.services.soilAnalysis.title'),
      description: t('home.services.soilAnalysis.description'),
      price: t('home.services.soilAnalysis.price'),
      image: '/images/services/soil-testing.jpg',
    },
    {
      title: t('home.services.droneMonitoring.title'),
      description: t('home.services.droneMonitoring.description'),
      price: t('home.services.droneMonitoring.price'),
      image: '/images/services/drone.jpg',
    },
  ];

  const testimonials = [
    {
      name: t('home.testimonials.farmer1'),
      role: t('home.testimonials.role1'),
      location: t('home.testimonials.location1'),
      rating: 5,
      text: t('home.testimonials.testimonial1'),
      avatar: '/images/testimonials/farmer1.jpg',
    },
    {
      name: t('home.testimonials.farmer2'),
      role: t('home.testimonials.role2'),
      location: t('home.testimonials.location2'),
      rating: 5,
      text: t('home.testimonials.testimonial2'),
      avatar: '/images/testimonials/farmer2.jpg',
    },
    {
      name: t('home.testimonials.farmer3'),
      role: t('home.testimonials.role3'),
      location: t('home.testimonials.location3'),
      rating: 5,
      text: t('home.testimonials.testimonial3'),
      avatar: '/images/testimonials/farmer3.jpg',
    },
  ];

  const statsData = [
    { label: t('home.stats.happyFarmers'), value: stats.farmers, suffix: '+', icon: <AgricultureIcon /> },
    { label: t('home.stats.hectaresManaged'), value: stats.hectares, suffix: '+', icon: <NatureIcon /> },
    { label: t('home.stats.waterSavings'), value: stats.savings, suffix: '%', icon: <WaterDropIcon /> },
    { label: t('home.stats.customerSatisfaction'), value: stats.satisfaction, suffix: '%', icon: <StarIcon /> },
  ];

  const benefits = t('home.benefits.list', { returnObjects: true });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/farm-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip 
                label={t('home.hero.badge')} 
                color="primary" 
                sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                {t('home.hero.title')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  opacity: 0.9,
                }}
              >
                {t('home.hero.subtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  startIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {t('home.hero.exploreProducts')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayIcon />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {t('home.hero.watchDemo')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper 
                  elevation={8} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: 'text.primary',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {t('home.hero.quickContact')}
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="+216 71 234 567" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WhatsAppIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="+216 98 765 432" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="info@investfarm.tn" />
                    </ListItem>
                  </List>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/contact')}
                    sx={{ mt: 2 }}
                  >
                    {t('home.hero.getFreeConsultation')}
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6 }}>
            {t('home.stats.title')}
          </Typography>
          <Grid container spacing={4}>
            {statsData.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'white', mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.value}{stat.suffix}
                  </Typography>
                  <Typography variant="body1">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2, color: 'primary.main' }}
        >
          {t('home.features.title')}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('home.features.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    color: feature.color,
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Services Preview */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2, color: 'primary.main' }}
          >
            {t('home.services.title')}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            {t('home.services.subtitle')}
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Typography variant="h6" color="secondary.main" sx={{ mb: 2 }}>
                      {service.price}
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/services')}
                    >
                      {t('home.services.learnMore')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ mb: 4, color: 'primary.main' }}>
              {t('home.benefits.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('home.benefits.subtitle')}
            </Typography>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/services')}
              startIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 4,
                py: 1.5,
              }}
            >
              {t('home.benefits.exploreAllServices')}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h4" sx={{ mb: 3 }}>
                  {t('home.benefits.successMetrics')}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{t('home.benefits.waterEfficiency')}</Typography>
                    <Typography>85%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{t('home.benefits.cropYieldIncrease')}</Typography>
                    <Typography>35%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={35} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{t('home.benefits.costReduction')}</Typography>
                    <Typography>40%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2, color: 'primary.main' }}
          >
            {t('home.testimonials.title')}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            {t('home.testimonials.subtitle')}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Avatar
                src={testimonials[currentTestimonial].avatar}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}
              />
              <Rating value={testimonials[currentTestimonial].rating} readOnly sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
                "{testimonials[currentTestimonial].text}"
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                {testimonials[currentTestimonial].name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
              </Typography>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
              {testimonials.map((_, index) => (
                <IconButton
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  sx={{
                    backgroundColor: currentTestimonial === index ? 'primary.main' : 'grey.300',
                    color: currentTestimonial === index ? 'white' : 'grey.600',
                    '&:hover': {
                      backgroundColor: currentTestimonial === index ? 'primary.dark' : 'grey.400',
                    },
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%' }} />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          py: 8,
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" align="center" sx={{ mb: 4 }}>
            {t('home.cta.title')}
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, opacity: 0.9 }}>
            {t('home.cta.subtitle')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                px: 4,
                py: 1.5,
              }}
            >
              {t('home.cta.getFreeConsultation')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                px: 4,
                py: 1.5,
              }}
            >
              {t('home.cta.viewProducts')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 