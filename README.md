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
This application uses **react-router-dom** for navigation and `<Link />` features. Inside the `<App />` component, you will find links to the pages listed below.

#### Wrappers
1. **`<WalletAdapter />`**:
   - Manages and controls Solana-based wallet connections.
   - Allows users to log in, reference public keys, and approve transactions.

2. **`<GlobalVariables />` Context**:
   - Stores a user's **Booh Token amount** and **in-game currency** across the entire website.
   - This data can later be used for a variety of features.

---

## Pages

Pages handle the main component renderings and help with content compartmentalization. The following pages include:

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
- The marketplace is where users can browse, filter, and purchase NFTs.
- The marketplace uses the `<useNFT />` hook to query and render NFT metadata from the MongoDB database.




