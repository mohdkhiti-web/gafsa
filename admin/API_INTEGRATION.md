# Admin Panel API Integration

This document outlines the changes made to integrate the admin panel with the backend API instead of using demo data.

## Changes Made

### 1. API Service (`src/services/api.js`)
- Created a centralized API service with axios instance
- Added request/response interceptors for authentication
- Implemented automatic token handling and error management
- Added service methods for all backend endpoints:
  - Users: CRUD operations
  - Equipment: CRUD operations  
  - Lands: CRUD operations
  - Orders: CRUD operations
  - Dashboard: Statistics aggregation

### 2. Authentication Context (`src/context/AuthContext.jsx`)
- Updated to use real backend authentication
- Integrated with JWT token system
- Added proper error handling for login failures
- Updated token storage to use `authToken` instead of `adminToken`

### 3. Dashboard (`src/pages/Dashboard.jsx`)
- Replaced hardcoded demo data with real API calls
- Added `fetchDashboardData()` function to aggregate statistics
- Implemented proper error handling with fallback to empty data
- Updated to use real order data for recent orders display

### 4. Users Management (`src/pages/Users.jsx`)
- Updated all API calls to use the centralized service
- Added proper error handling with user-friendly messages
- Fixed form validation and data structure
- Updated to use MenuItem components for select fields

### 5. Equipment Management (`src/pages/Equipment.jsx`)
- Integrated with backend equipment API
- Added proper error handling and user feedback
- Updated form data structure to match backend schema

### 6. Lands Management (`src/pages/Lands.jsx`)
- Connected to backend lands API
- Removed demo data fallback
- Added proper error handling
- Updated data display to show size in hectares

### 7. Orders Management (`src/pages/Orders.jsx`)
- Integrated with backend orders API
- Updated data structure to match backend schema
- Modified display fields to show order items count and user ID
- Added proper error handling

## Backend API Endpoints Used

- **Authentication**: `POST /auth/login`
- **Users**: `GET/POST/PATCH/DELETE /users`
- **Equipment**: `GET/POST/PATCH/DELETE /equipment`
- **Lands**: `GET/POST/PATCH/DELETE /lands`
- **Orders**: `GET/POST/PATCH/DELETE /orders`

## Authentication

The admin panel now uses JWT authentication with the backend:
- Login credentials are sent to `/auth/login`
- JWT token is stored in localStorage as `authToken`
- Token is automatically included in all API requests
- Automatic logout on token expiration (401 responses)

## Error Handling

- All API calls include proper error handling
- User-friendly error messages are displayed via Snackbar
- Console logging for debugging purposes
- Graceful fallbacks when API calls fail

## Usage

1. Start the backend server: `cd Backend && npm run start:dev`
2. Start the admin panel: `cd admin && npm run dev`
3. Login with valid backend credentials
4. All data will now be fetched from the backend API

## Notes

- The admin panel requires the backend to be running
- All CRUD operations now work with real data
- Authentication is required for all operations
- Data structure matches the backend Prisma schema
