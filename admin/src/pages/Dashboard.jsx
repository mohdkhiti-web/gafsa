import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Divider,
  Badge,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  LocalFlorist as ServicesIcon,
  Landscape as LandsIcon,
  Build as EquipmentIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { apiService } from '../services/api';

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalLands: 0,
    totalEquipment: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsData = await apiService.dashboard.getStats();
      setStats({
        totalUsers: statsData.totalUsers,
        totalProducts: statsData.totalEquipment, // Using equipment as products
        totalOrders: statsData.totalOrders,
        totalRevenue: statsData.totalRevenue,
        totalServices: statsData.totalOrders, // Using orders as services
        totalLands: statsData.totalLands,
        totalEquipment: statsData.totalEquipment,
      });

      // Fetch recent orders
      const ordersResponse = await apiService.orders.getAll();
      const recentOrdersData = ordersResponse.data.slice(0, 7).map((order, index) => ({
        id: order.id,
        user: `User ${order.userId}`,
        product: `Order #${order.id}`,
        amount: order.totalAmount || 0,
        status: order.status,
        priority: order.status === 'COMPLETED' ? 'high' : order.status === 'PENDING' ? 'medium' : 'low',
        time: new Date(order.createdAt).toLocaleDateString(),
      }));
      
      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty state if API fails
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalServices: 0,
        totalLands: 0,
        totalEquipment: 0,
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      change: '+12%',
      trend: 'up',
      subtitle: 'Active members',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon />,
      color: theme.palette.secondary.main,
      change: '+5%',
      trend: 'up',
      subtitle: 'In catalog',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <OrdersIcon />,
      color: '#2196f3',
      change: '+8%',
      trend: 'up',
      subtitle: 'This month',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} TND`,
      icon: <MoneyIcon />,
      color: '#4caf50',
      change: '+15%',
      trend: 'up',
      subtitle: 'Year to date',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  const salesData = [
    { name: 'Jan', sales: 18500, profit: 11200, orders: 45 },
    { name: 'Feb', sales: 22100, profit: 13800, orders: 52 },
    { name: 'Mar', sales: 19800, profit: 12100, orders: 48 },
    { name: 'Apr', sales: 25600, profit: 15800, orders: 61 },
    { name: 'May', sales: 31200, profit: 19200, orders: 73 },
    { name: 'Jun', sales: 28900, profit: 17800, orders: 68 },
    { name: 'Jul', sales: 33400, profit: 20500, orders: 78 },
  ];

  const categoryData = [
    { name: 'Products', value: 45, color: '#0088FE' },
    { name: 'Services', value: 25, color: '#00C49F' },
    { name: 'Lands', value: 20, color: '#FFBB28' },
    { name: 'Equipment', value: 10, color: '#FF8042' },
  ];

  const performanceData = [
    { metric: 'Customer Satisfaction', value: 94, target: 90, color: 'success' },
    { metric: 'Order Fulfillment', value: 87, target: 95, color: 'warning' },
    { metric: 'Revenue Growth', value: 112, target: 100, color: 'success' },
    { metric: 'Inventory Turnover', value: 78, target: 85, color: 'error' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #2e7d32, #4caf50)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Dashboard Overview
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Welcome back! Here's what's happening with your farm today.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={handleRefresh}
                sx={{ 
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.main' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Badge badgeContent={3} color="error">
              <IconButton sx={{ backgroundColor: 'secondary.light', color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
            </Badge>
          </Box>
        </Box>
        
        {loading && (
          <LinearProgress 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              background: 'linear-gradient(90deg, #4caf50, #8bc34a)'
            }} 
          />
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: card.gradient,
                color: 'white',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {card.subtitle}
                  </Typography>
                  <Chip
                    icon={getTrendIcon(card.trend)}
                    label={card.change}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Revenue Analytics
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Sales" size="small" color="primary" />
                  <Chip label="Profit" size="small" color="secondary" />
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#4caf50" 
                    fill="url(#salesGradient)"
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#ff9800" 
                    fill="url(#profitGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {categoryData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, mr: 1 }} />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Performance Metrics
              </Typography>
              <Grid container spacing={3}>
                {performanceData.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {metric.metric}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {metric.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(metric.value, 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette[metric.color].main}, ${theme.palette[metric.color].light})`,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Target: {metric.target}%
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Recent Orders
                </Typography>
                <Chip label={`${recentOrders.length} orders`} size="small" color="primary" />
              </Box>
              <List sx={{ p: 0 }}>
                {recentOrders.map((order, index) => (
                  <ListItem 
                    key={order.id} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      borderRadius: 2, 
                      backgroundColor: 'grey.50',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <OrdersIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {order.product}
                          </Typography>
                          <Chip
                            label={order.priority}
                            size="small"
                            color={getPriorityColor(order.priority)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.user} • {order.amount} TND • {order.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        icon={order.status === 'completed' ? <CheckCircleIcon /> : <WarningIcon />}
                      />
                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  { icon: <PeopleIcon />, title: 'Manage Users', color: 'primary', count: '1,247' },
                  { icon: <InventoryIcon />, title: 'Add Products', color: 'secondary', count: '89' },
                  { icon: <OrdersIcon />, title: 'View Orders', color: 'info', count: '456' },
                  { icon: <TrendingUpIcon />, title: 'Analytics', color: 'success', count: '24/7' },
                ].map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        background: `linear-gradient(135deg, ${theme.palette[action.color].light}20, ${theme.palette[action.color].main}20)`,
                        border: `1px solid ${theme.palette[action.color].light}`,
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: `0 8px 25px ${theme.palette[action.color].main}30`,
                          background: `linear-gradient(135deg, ${theme.palette[action.color].light}40, ${theme.palette[action.color].main}40)`,
                        },
                      }}
                    >
                      <Box sx={{ color: theme.palette[action.color].main, mb: 1 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.count}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 