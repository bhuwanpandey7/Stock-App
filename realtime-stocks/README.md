# RealtimeStocks

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

# Angular Stock List Application

This is a Real time stock Angular application that displays a list of stocks with price information. The app is structured using reusable components for better maintainability and scalability.

---

## Usage

### Prerequisites

- Node.js and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:

   git clone (https://github.com/bhuwanpandey7/Stock-App.git)
   cd realtime-stocks

Install dependencies:
 - npm run install:all  (will install dependencies for both backend server and front end app)

 npm run start (will run both backend and front end app parallely)
 - npm run start

  # scripts #
 -  "start": "npm-run-all --parallel backend frontend",
 -  "backend": "node src/backend/server.js",
 -  "frontend": "ng serve --proxy-config proxy.conf.json",

Run the development server:  
 Open your browser at http://localhost:4200 to see the app. 
   (Note: Added http://localhost:4200 to allowed CORS origin change or add if running on any other port)

---

## Features

- Fetches stock data from a yahoo finance using web sockets.
- Displays stocks in a responsive grid.
- Allows toggling stock enable/disable status.
- Highlights stock cards based on price conditions (positive/negative).
- Responsive layout adapts for mobile screens.
- Modular design with reusable `StockItemComponent`.

---

## Project Structure

src/
│
├── app/
│ ├── stock-list/ # Parent component displaying the stock grid
│ │ ├── stock-list.html
│ │ ├── stock-list.scss
│ │ └── stock-list.component.ts
│ │
│ ├── stock-item/ # Child reusable component for individual stock cards
│ │ ├── stock-item.html
│ │ ├── stock-item.scss
│ │ └── stock-item.component.ts
│ │
│ ├── models/
│ │ └── stock.interface.ts # Stock data interface
│ │
│ ├── services/
│ │ └── stock-price.service.ts # providing stock data & toggle method (adapter service for data transformation)
│ │
│ └── app.ts / main.ts # Angular bootstrap setup (standalone)
│
├── assets/
├── environments/
├── styles.scss
└── index.html

---

## Components

### StockListComponent

- Fetches the list of stocks from `StockPriceService` by mainting a connection to server using web socket.
- Tracks window size for responsive layout.
- Passes each stock and device info to `StockItemComponent`.
- Handles toggling stock enable state via service.

### StockItemComponent

- Receives a single `Stock` object and `isMobile` flag as inputs.
- Displays stock details (symbol, name, current price, daily/52W high-low).
- Applies styles conditionally for positive/negative/disabled states.
- Emits toggle events back to parent component.

---