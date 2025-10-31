import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  LocalFlorist as LocalFloristIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  WaterDrop as WaterDropIcon,
  PestControl as PestControlIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const services = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.consultation.title'),
      description: t('services.list.consultation.description'),
      price: t('services.list.consultation.price'),
      features: t('services.list.consultation.features', { returnObjects: true }),
      category: t('services.categories.consultation'),
      duration: t('services.list.consultation.duration')
    },
    {
      icon: <WaterDropIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.irrigation.title'),
      description: t('services.list.irrigation.description'),
      price: t('services.list.irrigation.price'),
      features: t('services.list.irrigation.features', { returnObjects: true }),
      category: t('services.categories.infrastructure'),
      duration: t('services.list.irrigation.duration')
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.analysis.title'),
      description: t('services.list.analysis.description'),
      price: t('services.list.analysis.price'),
      features: t('services.list.analysis.features', { returnObjects: true }),
      category: t('services.categories.analysis'),
      duration: t('services.list.analysis.duration')
    },
    {
      icon: <PestControlIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.pest.title'),
      description: t('services.list.pest.description'),
      price: t('services.list.pest.price'),
      features: t('services.list.pest.features', { returnObjects: true }),
      category: t('services.categories.protection'),
      duration: t('services.list.pest.duration')
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.analytics.title'),
      description: t('services.list.analytics.description'),
      price: t('services.list.analytics.price'),
      features: t('services.list.analytics.features', { returnObjects: true }),
      category: t('services.categories.technology'),
      duration: t('services.list.analytics.duration')
    },
    {
      icon: <LocalFloristIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.certification.title'),
      description: t('services.list.certification.description'),
      price: t('services.list.certification.price'),
      features: t('services.list.certification.features', { returnObjects: true }),
      category: t('services.categories.certification'),
      duration: t('services.list.certification.duration')
    },
    {
      icon: <StorageIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.postharvest.title'),
      description: t('services.list.postharvest.description'),
      price: t('services.list.postharvest.price'),
      features: t('services.list.postharvest.features', { returnObjects: true }),
      category: t('services.categories.processing'),
      duration: t('services.list.postharvest.duration')
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      title: t('services.list.training.title'),
      description: t('services.list.training.description'),
      price: t('services.list.training.price'),
      features: t('services.list.training.features', { returnObjects: true }),
      category: t('services.categories.education'),
      duration: t('services.list.training.duration')
    }
  ];

  const categories = [t('services.categories.all'), t('services.categories.consultation'), t('services.categories.infrastructure'), t('services.categories.analysis'), t('services.categories.protection'), t('services.categories.technology'), t('services.categories.certification'), t('services.categories.processing'), t('services.categories.education')];
  const [selectedCategory, setSelectedCategory] = useState(t('services.categories.all'));

  const filteredServices = selectedCategory === t('services.categories.all') 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/services-hero.jpg')`,
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
            {t('services.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {t('services.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: 'primary.main' }}>
            {t('services.chooseCategory')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {filteredServices.map((service, index) => (
            <Grid item xs={12} lg={6} key={index}>
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
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {service.icon}
                    <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="secondary.main" fontWeight="bold">
                      {service.price}
                    </Typography>
                    <Chip 
                      label={service.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {service.duration}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Accordion 
                    expanded={expanded === `panel${index}`} 
                    onChange={handleAccordionChange(`panel${index}`)}
                    sx={{ boxShadow: 'none' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {t('services.viewFeatures')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {service.features.map((feature, featureIndex) => (
                          <ListItem key={featureIndex} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon color="primary" sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      mt: 2,
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      py: 1.5,
                    }}
                  >
                    {t('services.bookService')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Us Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'primary.main' }}>
            {t('services.whyChoose')}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <LocationOnIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('services.features.local.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('services.features.local.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <TrendingUpIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('services.features.results.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('services.features.results.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SecurityIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('services.features.support.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('services.features.support.description')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Contact CTA */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              {t('services.cta.title')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t('services.cta.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                {t('services.cta.contact')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {t('services.cta.quote')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Services; 