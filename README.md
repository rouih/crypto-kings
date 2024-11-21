# Wallet Management API

## Overview

The **Wallet Management API** is designed to allow users to manage their crypto asset balances. Users can perform operations such as adding assets, removing assets, viewing total balances, and rebalancing their portfolio to match specific target percentages.

---

## Endpoints

### **POST /balances/add**

#### Description

Adds a specified amount of a particular asset to the user's balance.

#### Request Body

```json
{
  "asset": "bitcoin",
  "amount": 1.5
}
```

#### Response

```json
{
  "message": "Balance added successfully"
}
```

### **POST /balances/rebalance**

#### Description

Rebalances the user's portfolio to match specific target percentages.

#### Request Body

```json
{
  "bitcoin": 50,
  "ethereum": 50
}
```

#### Response

```json
{
  "message": "Balances rebalanced successfully"
}
```

### **DELETE /balances/remove**

#### Description

Removes a specified amount of a particular asset from the user's balance.

#### Request Body

```json
{
  "amount": 1.5
}
```

#### Response

```json
{
  "message": "Balance removed successfully"
}
```

### **GET /balances/userBalance**

#### Description

Returns the user's total balance in a specific currency.

#### Response

```json
{
  "bitcoin": 1.5,
  "ethereum": 2.5
}
```

### **GET /balances/total**

#### Description

Returns the user's total balance in a specific currency.

#### Response

```json
{
  "bitcoin": 1.5,
  "ethereum": 2.5
}
```

---

## Installation

To install the **Wallet Management API**, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crypto-kings.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm run start
   ```

---

## Docker Installation

To install the **Wallet Management API** using Docker, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crypto-kings.git
   ```

2. Build the Docker image:

   ```bash
   docker build -t wallet-management-api .
   ```

3. Run the Docker container:

   ```bash
   docker run -p 3000:3000 wallet-management-api
   ```

## Docker Compose Installation

To install the **Wallet Management API** using Docker Compose, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crypto-kings.git
   ```

2. Build the Docker image:

   ```bash
   docker-compose build
   ```

3. Run the Docker container:

   ```bash
   docker-compose up  -d
   ```

---

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

```
