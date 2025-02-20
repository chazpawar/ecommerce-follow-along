# Milestone 20 & 21: User Profile and Address Management

## Milestone 20: User Profile Implementation
- Implemented user profile display with:
  - Profile photo
  - Name and email display
  - Addresses list
  - Basic address management

## Milestone 21: Address Form Implementation

### Features Implemented

#### Address Form Page
- Created dedicated address form with fields for:
  - Country
  - City
  - Address Line 1 (Required)
  - Address Line 2 (Optional)
  - ZIP Code
  - Address Type (Home/Work/Other)
- Implemented form state management using React useState hook
- Added proper validation for required fields
- Responsive design using Tailwind CSS

#### Navigation Flow
- "Add Address" button in profile redirects to address form
- Form submission returns to profile page
- Automatic profile refresh after address addition
- Cancel button for easy navigation back to profile

#### State Management
- Form data managed through React state
- Real-time input validation
- Proper error handling and display
- Seamless integration with profile page

### Technical Implementation

#### Component Structure
```jsx
// AddressForm.jsx
- Form state management using useState
- Input change handlers
- Form submission handling
- Navigation integration
- Validation implementation

// Profile.jsx
- Updated to include address form navigation
- Address list display
- Address deletion functionality
- Profile data management
```

#### Route Configuration
- Added `/add-address` route
- Protected route implementation
- Navigation handling with react-router-dom

## How to Test
1. Log in to the application
2. Navigate to Profile page
3. Click "Add Address" button
4. Fill in the address form:
   - Enter country
   - Provide city
   - Fill required Address Line 1
   - Add optional Address Line 2 (if needed)
   - Enter ZIP code
   - Select address type (Home/Work/Other)
5. Submit the form to add address
6. Verify the new address appears in profile
7. Test cancel functionality to ensure proper navigation

## Milestone 22: Backend Address Integration

### Features Implemented

#### Backend Endpoint
- Created new endpoint `/api/users/:id/address` for adding addresses
- Implemented address storage in user profile database
- Added proper validation for required address fields
- Automatic default address setting for first address

#### Technical Implementation

##### API Endpoint Structure
```javascript
POST /api/users/:id/address
Protected Route (Requires Authentication)

Request Body:
{
  "country": "string",
  "city": "string",
  "street": "string",
  "address2": "string" (optional),
  "zipCode": "string",
  "addressType": "string"
}

Response:
{
  "success": true,
  "message": "Address added successfully",
  "data": [addresses]
}
```

##### Backend Components
- Added address controller in userController.js
- Updated User model with address schema
- Added protected route in userRoutes.js
- Implemented proper error handling
- Added authentication protection

### Integration Testing
1. Log in to get authentication token
2. Use the token to make POST request to add address
3. Verify address appears in user profile
4. Check default address setting
5. Validate error handling for missing fields

## Future Improvements
- Address editing functionality
- Address type customization
- Default address selection
- Form field validation improvements
- Address format standardization
- Geocoding integration
- Address verification system