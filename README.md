# NFT Booh World / Booh Brawlers

Welcome to the marketplace and creative hub for **Booh World / Booh Brawlers**. This is a full-stack website built with the following frameworks and hosting services.

The purpose of this website is twofold:
1. Allow users to purchase **Booh Brawlers NFTs** from an online marketplace.
2. Enable community members to create NFT metadata, which may later be used in the in-game store.

The site supports seamless integration with Solana-based crypto wallets like **Phantom Wallet** or **Solflare**. Once connected, users gain access to create, edit, and buy NFTs depending on their user access level.

## **Table of Contents**
1. [Tech Stack](#tech-stack)
2. [Setup](#setup)
   - [NPM Installs](#npm-installs)
   - [Start the Application](#start-the-application)
3. [Application Details](#application-details)
   - [Front-End](#front-end)
   - [App Wrappers](#apps-parent-component-app--walletadapter)
   - [Pages Overview](#pages)
     - [LandingPage](#landingpage)
     - [Homepage](#homepage)
       - [Navbar](#navbar)
       - [SideNav](#sidenav)
       - [NFTPreview](#nftpreview)
       - [NFTUpdate](#nftupdate)

---

## **Tech Stack**
- **Front-End**: React/Vite (see `package.json` for version details)
- **Front-End Hosting**: Cloudflare
- **Back-End**: Node.js (see `server/package.json` for version details)
- **Database**: MongoDB
- **Server Hosting**: Google Cloud App Engine

> **Note**: Permissions to these services must be requested from an organization admin or owner. URL links are stored in ENV files that are not publicly accessible. Request access to these ENV variables through an admin or owner.

---

## **Setup**

### **NPM Installs**

Before starting, run the following commands to ensure all necessary npm packages are installed:

```bash
# Inside the root folder "/"
npm i

# Inside the server folder "/server"
npm i

# Inside the client folder "/client"
npm i
```

---

## IMPORTANT
If you do not have access to the ENV variables, please request them. Once the project is loaded, some features will not work such as many API fetches.

---

## Start the Application

Inside the root folder - `/`:
```bash
npm run start
```

---

# APPLICATION DETAILS

There are many interactions between the front and back end of this program. This section will help break down these interactions as best as possible. We will start with the **Front Side Application**.

---

## FRONT SIDE APPLICATION

### Components
Inside the `/client/src/components` folder, you will find the components that make up the JavaScript and HTML content for the website.

### Utils
Any helper functions, such as recurring API calls, blockchain interactions, or simple utility functions, are located inside the `/client/src/Utils` folder.

### CSS Styling
- Some CSS styling is broken into separate `.css` files (e.g., `Docs.css` for the Documents page, `Modal.css` for the `txModal` component).
- However, the bulk of the styling is centralized in `index.css`.
- A dedicated folder for CSS files has been created, but migration of all styles has not yet occurred.

---

## APP's Parent Component `<App />` && `<WalletAdapter />`

### App Wrappers
The `<App>` component is wrapped by two parent components allowing access to variables throughout the frontend components.

#### Wrappers
1. **`<WalletAdapter />`**:
   - Manages and controls Solana-based wallet connections.
   - Allows users to log in, reference public keys, and approve transactions.

2. **`<GlobalVariables />` Context**:
   - Stores a user's **Booh Token amount** and **in-game currency** across the entire website.
   - This data can later be used for a variety of features.

---

## Pages

This application uses **react-router-dom** for navigation and `<Link />` features. Inside the `<App />` component, you will find links to the pages listed below. Pages handle the main component renderings and help with content compartmentalization. The following pages include:

### LandingPage
- **URL**: [https://nft.boohworld.io](https://nft.boohworld.io)
- Features:
  - Directs users to create, edit, or view documents.
  - Includes components like `<Navbar />` (persistent across pages) and `<ImageCarousel />` (scrolls through NFT metadata).

### Homepage: [https://nft.boohworld/io](https://nft.boohworld.io/dashboard?=update)
This is where all the magic happens in terms of members creating and managing their Booh NFT metadata. Within the `<Homepage />`, several components work together.

#### Key Components:
1. **`<Navbar />`**:
   - Handles navigation and wallet tracking via the `<SolConnection />` component.
   - Queries blockchain data for Booh Tokens and in-game currency amounts.
2. **`<SideNav />`**:
   - Handles user input for NFT creation and updates.
   - Displays relevant game configuration data based on user permissions.
3. **`<NFTPreview />`**:
   - Displays a quick preview of the NFT based on user input.
4. **`<NFTUpdate />`**:
   - Renders all NFT metadata from the database using `<PrintNFTs />` and the help of `<Filter />`.
   - Allows updates to metadata and enables admin-level actions like minting NFTs.

---

### Marketplace

The `Marketplace` component is the central hub for interacting with and managing NFTs in the **Booh World** marketplace. It facilitates user actions such as viewing NFTs, creating NFTs, and handling payment flows using various methods (e.g., SOL, Baby Booh, and credit card).

---

#### **useState Variables**

Below are the state variables used in this component and their purposes:

1. **NFT and Wallet Management**
   - `nfts`: Stores the array of NFTs available in the marketplace.
   - `selectedIndex`: Tracks the currently selected NFT index.
   - `nameTracker`: Tracks the name of the selected NFT.

2. **Modal and UI States**
   - `isModalOpen`: Controls the visibility of the transaction modal.
   - `txState`: Tracks the transaction state (`empty`, `started`, `complete`, `failed`).
   - `createState`: Tracks the state of NFT creation (`empty`, `started`, `complete`, `failed`).

3. **Payment and Pricing**
   - `preCalcPayment`: Stores the calculated payment value for the selected NFT.
   - `paymentTracker`: Tracks the selected payment method (`SOL`, `CARD`, or `BABYBOOH`).
   - `solPriceLoaded`: Indicates whether the SOL price has been calculated and loaded.

4. **Stripe Integration**
   - `stripeSecret`: Stores the `client_secret` returned from the Stripe PaymentIntent.
   - `stripeModal`: Toggles the visibility of the Stripe modal.
   - `redirectSecret`: Handles the `client_secret` during redirect scenarios.

5. **Utility States**
   - `transactionSig`: Stores the transaction signature after NFT creation.
   - `message`: Tracks status messages displayed to the user.

---

#### **Key Functions**

1. **Payment Handling**
   - `payWithSol`: Creates and sends a Solana transaction to pay for the NFT.
   - `payWithBabyBooh`: Handles payment via the Baby Booh token.
   - `payWithCard`: Opens the Stripe payment modal.

2. **NFT Creation**
   - `createNft`: Handles the process of NFT creation after payment is completed.
   - `handleNFTCreation`: Responsible for calling the blockchain interaction to create an NFT.

3. **Stripe Payment Integration**
   - `handleSuccessfulStripePayment`: Handles the workflow for creating NFTs after a successful Stripe payment.
   - `setUpModalPricing`: Dynamically calculates and sets the payment value and updates the UI for the selected payment method.

4. **Modal Controls**
   - `openModal`: Opens the transaction modal for the selected NFT.
   - `resetConfirmModal`: Resets the modal state after a transaction or creation process.

---

#### **Key Components**

1. **`<Navbar />`**
   - Handles navigation and wallet tracking.
   - Tracks the logged-in user's wallet and fetches their associated Booh Tokens and in-game currency.

2. **`<PrintNfts />`**
   - Displays the list of NFTs available in the marketplace.
   - Accepts props such as `nfts`, `selectedIndex`, and handlers for selection and payment tracking.

3. **`<Filter />`**
   - Allows users to filter NFTs by type, rarity, and creator.

4. **`<TxModal />`**
   - Displays transaction details and progress to the user.
   - Allows users to confirm and proceed with NFT creation.

5. **`<Stripe />`**
   - Handles the payment flow for credit card transactions via Stripe.
   - Supports both direct PaymentIntent creation and redirect scenarios.

---

#### **Component Workflow**

1. **NFT Selection**
   - The user selects an NFT from the marketplace (`<PrintNfts />` updates the `selectedIndex`).

2. **Modal Setup**
   - When the user initiates a purchase, the transaction modal is opened using `openModal`.
   - Payment calculations are dynamically set up via `setUpModalPricing`.

3. **Payment Flow**
   - Based on the selected payment method:
     - SOL: Processes the transaction on the Solana blockchain (`payWithSol`).
     - Baby Booh: Calls the API to deduct the token amount (`payWithBabyBooh`).
     - Credit Card: Initiates the Stripe PaymentIntent and opens the Stripe modal.

4. **NFT Creation**
   - Once payment is confirmed, `createNft` calls `handleNFTCreation` to mint the NFT on the blockchain.

5. **Stripe Redirect**
   - After a successful Stripe payment redirect, the `handleSuccessfulStripePayment` function finalizes the NFT creation process.

---

#### **External Utilities and APIs**

- **`useNFTs` Hook**: Handles fetching and filtering NFT metadata.
- **`priceToSol` Utility**: Converts the NFT price into SOL, accounting for minting costs.
- **`createPaymentIntent` API**: Creates a Stripe PaymentIntent for credit card payments.
- **`deductBabyBooh` API**: Deducts Baby Booh tokens for NFT purchases.
- **`fetchSingleNftMetadata` API**: Retrieves metadata for a specific NFT during the Stripe redirect workflow.

---

#### **Error Handling**

- The component includes `try...catch` blocks in critical functions to ensure proper error reporting and graceful handling of issues (e.g., invalid NFT data, failed transactions).
- Errors are logged to the console for debugging.

---

This section provides an overview of the key elements and workflows of the `Marketplace` component. You can expand or refine it based on your specific needs!





