# Milestone 20: User Profile Implementation

## Overview
This milestone implements a comprehensive user profile system that displays user information and manages addresses.

## Features Implemented

### Backend Endpoints
- **GET /api/users/:id** - Fetches user profile data including:
  - Name
  - Email
  - Profile photo
  - Addresses

- **POST /api/users/:id/address** - Adds a new address
- **PUT /api/users/:id/address/:addressId** - Updates existing address
- **DELETE /api/users/:id/address/:addressId** - Removes an address

### Frontend Components
- **Profile Page** featuring:
  - User information section displaying:
    - Profile photo (with default avatar)
    - User name
    - Email address
  - Address management section with:
    - List of saved addresses
    - "Add Address" button
    - "No addresses found" message when no addresses exist
    - Delete functionality for existing addresses

## Technical Implementation

### User Model
```javascript
{
  name: String,
  email: String,
  profilePicture: String,
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }]
}
```

### Routes
- Profile data endpoint: `/api/users/:id`
- Address management endpoints:
  - Add: POST `/api/users/:id/address`
  - Update: PUT `/api/users/:id/address/:addressId`
  - Delete: DELETE `/api/users/:id/address/:addressId`

## How to Test
1. Log in to the application
2. Click on the "PROFILE" link in the navigation bar
3. View your profile information
4. Try adding a new address using the "Add Address" button
5. Verify the "No addresses found" message appears when no addresses exist
6. Test deleting addresses

## Future Improvements
- Add ability to set a default address
- Implement address editing functionality
- Add profile picture upload capability
- Add form validation for address fields