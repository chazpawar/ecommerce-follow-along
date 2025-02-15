## Milestone 1

1. Server Functionality in an E-Commerce Site
In an e-commerce site, the server is the central body performing vital functions such as browsing products, processing orders, and updating real-time stock information.

The server fetches data when the user browses; for instance, it will retrieve product images, descriptions, and prices from the database and transmit them to the client or the browser. In addition, the server dynamically updates stock levels during events such as sales to avoid discrepancies in stock counts.

Order Processing Workflow:

Stock Verification: Validates the existence of products in the user's shopping cart. Payment Verification: Encryption and processing of payment details with the help of payment gateways. Inventory update: Updates the stock quantity so that overselling is prevented Order Confirmation: Generates receipts and sends a message to the customer Logistics Coordination: Contacts shipping services to print the labels and track orders The server ensures consistency, security, and reliability even in high loads

2. Communication of Mobile Banking Application
Mobile banking apps depend on secure, real-time client-server communication to provide a seamless user experience.

Connection and Authentication:

• App connects to the server using HTTPS with TLS-encrypt communication. • The server issues a session token for subsequent requests after a successful login. Secure Operations:

For example, to check your account balance: The app transmits the request with a session token. The server verifies the token, fetches data from its own database, encrypts the reply, and then sends it. The app decrypts the reply and shows the balance Optimizations : To gain fast speed, the app might have cached earlier data while downloading newer updates in the background. The user is therefore assured of having a safe experience even in such complex operations

3. Integration with Food Delivery App
Food delivery applications integrate several systems through APIs for a seamless user experience.

Order Workflow

Menu API: retrieves the latest restaurant menu and checks the availability of items Payment API: ensures safe payment using credit cards, wallets, or UPI Delivery API: tracks the couriers, optimizes routes, and shares real-time information with the application regarding the delivery status, for instance, "Out for Delivery.". Communication Standards: APIs employ standardized forms like JSON or XML for streamlined communication between systems. This guarantees that even with an extremely complex application, service is never interrupted to users.

4. HTTPS and Payment Security
HTTPS assures secure communication in transactions related to payment. Sensitive information on a user would never be hacked through HTTPS due to the protection by: Encryption of Communication: The use of TLS to encrypt data in transmission, which would make it illegible to hackers. Authentication of the Server: SSL/TLS certificates validate the identity of the server. Ensure data integrity: Prevent data tampering at the time of transmission. When a credit card number is filled, the lock icon in the browser appears indicating the connection is safe. This decreases the chance of interception or theft of data.

5. CRUD Operations
CRUD operations are the core application for data management.

Examples:

Create: creating an account or adding a product to the cart Read: catalog of products or order history. Update: change delivery address or account information. Delete: remove an item from the cart or cancel an order. Implementation: In SQL databases: CREATE corresponds to INSERT. READ corresponds to SELECT. UPDATE corresponds to UPDATE. DELETE corresponds to DELETE. In NoSQL databases, there are corresponding methods that do the same thing. Access permissions guarantee secure CRUD operations based on user roles.

## Milestone 2: Project Setup and Login Page

In this milestone, we:
- Structured the project into `frontend` and `backend` folders.
- Set up a React app for the frontend.
- Configured Tailwind CSS for styling.
- Built a Login Page using React and Tailwind.
- Created a basic Express server for the backend.

## Milestone 3: Backend Setup and Database Connection

In this milestone, we:
- Organized the backend folder structure for scalability.
- Set up a Node.js server using Express.
- Connected the application to MongoDB for data storage.
- Implemented API routes for user signup and login.
- Added basic error handling for better debugging.

### Key Features:
- **Backend Structure**: Organized into `routes`, `controllers`, `models`, and `middleware`.
- **Database**: Integrated MongoDB for storing user data.
- **Error Handling**: Added middleware to handle server errors gracefully.

## Milestone 4: User Model, Controller, and File Uploads

In this milestone, we:
- Created a **User Model** to define the structure of user data in the database.
- Built a **User Controller** to handle user registration and fetching user details.
- Configured **Multer** to enable file uploads (e.g., profile pictures).
- Updated the backend to store and retrieve user data with profile pictures.

### Key Features:
- **User Model**: Defines user schema with fields for `name`, `email`, `password`, and `profilePicture`.
- **User Controller**: Handles user registration and fetching user details.
- **Multer**: Enables file uploads and stores files in the `uploads` folder.

## Milestone 5: Sign-Up Page

In this milestone, I created the Sign-Up page on the frontend using React and Tailwind CSS. Key features include:
- A clean and responsive UI for user registration.
- Form validation for ensuring valid email format and a minimum password length of 6 characters.
- Error messages to guide users when inputs are invalid.

The next step will be connecting the Sign-Up form to the backend API for user registration.

## Milestone 6: Backend Signup Endpoint 🚀
In this milestone, we created the backend logic to handle user registration securely.

Key Features Implemented
User Registration Endpoint: POST /api/users/signup
Password Encryption: Used bcryptjs to hash user passwords before saving them to the database.
User Data Storage: Saved user information (name, email, password, and profile picture) in MongoDB.
Technologies Used
Node.js with Express.js for the backend.
Mongoose for MongoDB interaction.
bcryptjs for password hashing.
Multer for handling file uploads.

## Milestone 7: User Login Functionality

### Features Implemented:
- Created a backend endpoint for user login.
- Validated user credentials and compared the encrypted password using `bcrypt`.
- Returned appropriate responses for successful login and failed attempts.

### Login Endpoint:
**POST /api/users/login**

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}

## Milestone 8: Product Card and Homepage Layout

### Features Implemented:
- Created a reusable `ProductCard` component that accepts props for product details.
- Displayed multiple product cards on the homepage using a grid layout.
- Styled the components using Tailwind CSS for a modern, responsive design.

### Technologies Used:
- React
- Tailwind CSS

### Milestone 9: Product Form Creation 📦
Overview 🌟
Created a Product Form for adding product details and uploading multiple images. This form will save product data to the database and display it on the product listing page.

Features 🛠️
Form Fields: Product Name, Description, Price, Category, and Image Upload (supports multiple images with preview).
Interactive UI: Responsive with 3D hover effects and toast notifications.
Routing: Accessible at /create-product.

## Milestone 10: Product Schema and Endpoint Creation 🚀
Overview
In this milestone, we created a Mongoose schema for products and built a POST endpoint to validate and store product details in MongoDB. This ensures data integrity and lays the foundation for managing products in the database.

Key Features
Mongoose Product Schema:

Defines product data structure (name, description, price, images, etc.)
Includes validation for required fields and correct data types
POST Endpoint:

Receives product data from the frontend
Validates and saves the data to MongoDB

E-Commerce Project — Milestone 11
Objective: Enhance product cards and implement filtering, sorting, and search features for product listings.

Features
Product Filtering: By category and price range
Sorting: Price (Low to High, High to Low) & Name (A-Z, Z-A)
ProductCard Enhancements: 3D hover effects, "Add to Cart" functionality, and dynamic product details
Search Bar: Quickly find products by name

Milestone 12: My Products Page
In this milestone, we implemented the My Products page, which displays all the products uploaded by the currently logged-in user. This involves setting up a new route and creating a React component that fetches and displays the user's products.

Milestone Goals
Create a My Products page.
Set up a backend route to fetch products based on the logged-in user's email.
Fetch and display the user's products in a responsive grid layout.

## Milestone 13: Product Editing Functionality 🔄

In this milestone, we implemented the ability to edit existing products by adding an edit button to product cards and creating a backend endpoint to update data in MongoDB. This enhancement allows users to modify their uploaded products easily.

### Features Implemented:
- Added an edit button to product cards (visible only to product owners)
- Created a PUT endpoint (/api/products/update/:id) for updating product data
- Enhanced ProductForm component to handle both creation and editing modes
- Implemented auto-filling of form with existing product data
- Added support for updating or keeping existing product images

### Technical Highlights:
- Backend route for updating products in MongoDB
- Frontend form validation with optional image upload for edits
- Secure editing (only product owners can edit their products)
- Real-time UI updates after successful edits

## Milestone 14: Product Deletion Functionality 🗑️

In this milestone, we implemented the ability to delete products by adding a delete button to product cards and creating a backend endpoint to remove data from MongoDB.

### Features Implemented:
- Added a delete button to product cards (visible only to product owners)
- Created a DELETE endpoint (/api/products/delete/:id) for removing products
- Added confirmation dialog before deletion
- Implemented cleanup of associated image files

### Technical Highlights:
- Backend route for deleting products from MongoDB
- Secure deletion (only product owners can delete their products)
- Automatic cleanup of uploaded image files
- User feedback with loading states and notifications


Milestone 15: Navbar Component

Overview 🌟

In this milestone, we will create a reusable Navbar component and integrate it into every screen of our application. The Navbar will contain links to different pages and will be responsive to all screen sizes.

Learning Goals 🎯

By completing this milestone, you will learn:

How to create a Navbar component.

How to reuse the same component across multiple pages.

How to make a Navbar responsive.



Milestone 16: Product Info Page

Overview 🌟

In this milestone, we will create a product info page that displays all product details, allows users to select quantity, and includes an 'Add to Cart' button.

Learning Goals 🎯

By completing this milestone, you will learn:

How to create a new page to display each product.

How to add a quantity selector and an 'Add to Cart' button.

Steps for Milestone 16 📝

Create a new product info page that displays all the product details.

Add a quantity selector to allow users to choose the number of items.

Include an 'Add to Cart' button to enable users to add products to their cart.

