import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Cart = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  
  // State for cart items (local cart for non-authenticated users)
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for checkout process
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch user orders if authenticated, otherwise use local cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isAuthenticated) {
          // For authenticated users, fetch their orders
          const userOrders = await apiService.orders.getMyOrders();
          setOrders(userOrders);
          // Convert orders to cart items format
          const cartFromOrders = userOrders
            .filter(order => order.status === 'PENDING' || order.status === 'CART')
            .flatMap(order => 
              order.orderItems?.map(item => ({
                id: item.equipmentId || item.id,
                name: item.equipment?.name || item.name || 'Unknown Product',
                price: item.price || 0,
                originalPrice: item.equipment?.originalPrice || item.price || 0,
                quantity: item.quantity || 1,
                image: item.equipment?.image || '/images/products/default.jpg',
                category: item.equipment?.category || 'General',
                inStock: true,
                rating: 4.5,
                reviews: 0,
              })) || []
            );
          setCartItems(cartFromOrders);
        } else {
          // For non-authenticated users, use local cart
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(localCart);
        }
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError('Failed to load cart data');
        // Fallback to local cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localCart);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 25 : shippingMethod === 'standard' ? 15 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  // Cart item management functions
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        // Update quantity in backend
        // This would require a specific API endpoint for updating cart items
        // For now, we'll update locally and sync later
        setCartItems(prev => 
          prev.map(item => 
            item.id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } catch (err) {
        console.error('Error updating quantity:', err);
        setSnackbar({
          open: true,
          message: 'Failed to update quantity',
          severity: 'error',
        });
      }
    } else {
      // Update local cart
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      localStorage.setItem('cart', JSON.stringify(cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )));
    }
  };

  const removeItem = async (itemId) => {
    if (isAuthenticated) {
      try {
        // Remove from backend
        // This would require a specific API endpoint for removing cart items
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      } catch (err) {
        console.error('Error removing item:', err);
        setSnackbar({
          open: true,
          message: 'Failed to remove item',
          severity: 'error',
        });
      }
    } else {
      // Remove from local cart
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      localStorage.setItem('cart', JSON.stringify(cartItems.filter(item => item.id !== itemId)));
    }
    
    setSnackbar({
      open: true,
      message: 'Item removed from cart',
      severity: 'info',
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem('cart');
    }
  };

  // Checkout functions
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to proceed with checkout',
        severity: 'warning',
      });
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          equipmentId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        status: 'PENDING',
        paymentMethod: 'CARD',
        shippingAddress: 'Default Address', // This should come from a form
        notes: `Order placed via cart. Coupon: ${couponCode || 'None'}`,
      };

      await apiService.orders.create(orderData);
      
      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success',
      });
      
      setShowCheckoutDialog(false);
      clearCart();
      
    } catch (err) {
      console.error('Error placing order:', err);
      setSnackbar({
        open: true,
        message: 'Failed to place order. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckoutDialog(false);
    setActiveStep(0);
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const steps = ['Review Order', 'Payment', 'Confirmation'];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Loading cart...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/products"
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 4,
                py: 1.5,
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/cart-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '40vh',
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
            Shopping Cart
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Review your items and proceed to checkout
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
              Cart Items ({cartItems.length})
            </Typography>
            
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 3, position: 'relative' }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="secondary.main" fontWeight="bold">
                          {item.price} TND
                        </Typography>
                        {item.originalPrice > item.price && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ textDecoration: 'line-through', ml: 1 }}
                          >
                            {item.originalPrice} TND
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          ★ {item.rating} ({item.reviews} reviews)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        {item.price * item.quantity} TND
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton 
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary">
                          <FavoriteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                href="/products"
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                  Order Summary
                </Typography>

                {/* Coupon Code */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    size="small"
                  />
                  <Button
                    variant="text"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Apply Coupon
                  </Button>
                </Box>

                {/* Shipping Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Shipping Method
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      <MenuItem value="standard">Standard Delivery (3-5 days)</MenuItem>
                      <MenuItem value="express">Express Delivery (1-2 days)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Price Breakdown */}
                <List dense>
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body2" fontWeight="bold">
                      {calculateSubtotal()} TND
                    </Typography>
                  </ListItem>
                  {calculateDiscount() > 0 && (
                    <ListItem>
                      <ListItemText primary="Discount" />
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        -{calculateDiscount()} TND
                      </Typography>
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body2" fontWeight="bold">
                      {calculateShipping() === 0 ? 'Free' : `${calculateShipping()} TND`}
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText 
                      primary="Total" 
                      primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    />
                    <Typography variant="h6" color="secondary.main" fontWeight="bold">
                      {calculateTotal()} TND
                    </Typography>
                  </ListItem>
                </List>

                {/* Free Shipping Alert */}
                {calculateSubtotal() < 500 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Add {(500 - calculateSubtotal()).toFixed(0)} TND more for free shipping!
                  </Alert>
                )}

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  startIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 3,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    py: 1.5,
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* Security & Support */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <SecurityIcon color="primary" />
                    <SupportIcon color="primary" />
                    <ShippingIcon color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Secure payment • 24/7 support • Free shipping over 500 TND
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Checkout Dialog */}
        <Dialog 
          open={showCheckoutDialog} 
          onClose={handleCloseCheckout}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">Checkout</Typography>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
             {activeStep === 0 && (
               <Box>
                 <Typography variant="h6" sx={{ mb: 2 }}>
                   Review Your Order
                 </Typography>
                 <List>
                   {cartItems.map((item) => (
                     <ListItem key={item.id}>
                       <ListItemText
                         primary={item.name}
                         secondary={`Quantity: ${item.quantity} × ${item.price} TND`}
                       />
                       <Typography variant="h6">
                         {(item.price * item.quantity).toFixed(2)} TND
                       </Typography>
                     </ListItem>
                   ))}
                 </List>
                 <Divider sx={{ my: 2 }} />
                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                   <Typography variant="h6">Total</Typography>
                   <Typography variant="h6" color="primary">
                     {total.toFixed(2)} TND
                   </Typography>
                 </Box>
               </Box>
             )}

             {activeStep === 1 && (
               <Box>
                 <Typography variant="h6" sx={{ mb: 2 }}>
                   Payment Information
                 </Typography>
                 <Alert severity="info" sx={{ mb: 2 }}>
                   This is a demo. No real payment will be processed.
                 </Alert>
                 <TextField
                   fullWidth
                   label="Card Number"
                   placeholder="1234 5678 9012 3456"
                   sx={{ mb: 2 }}
                 />
                 <Grid container spacing={2}>
                   <Grid item xs={6}>
                     <TextField
                       fullWidth
                       label="Expiry Date"
                       placeholder="MM/YY"
                     />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField
                       fullWidth
                       label="CVV"
                       placeholder="123"
                     />
                   </Grid>
                 </Grid>
               </Box>
             )}

             {activeStep === 2 && (
               <Box sx={{ textAlign: 'center' }}>
                 <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                 <Typography variant="h6" sx={{ mb: 2 }}>
                   Order Confirmed!
                 </Typography>
                 <Typography variant="body1" color="text.secondary">
                   Your order has been placed successfully. You will receive a confirmation email shortly.
                 </Typography>
               </Box>
             )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCheckout}>Cancel</Button>
            {activeStep < 2 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                {activeStep === 1 ? 'Place Order' : 'Next'}
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
              >
                Complete Order
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Cart; 