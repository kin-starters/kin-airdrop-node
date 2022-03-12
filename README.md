# kin-airdrop-node

This starter shows how to implement a simple API that allows you to airdrop KIN to a Solana account.

In order to send the KIN, this API needs to have an _Airdrop Account_ configured. Read the details in `.env.example` about how to create an _Airdrop Account_.

It implements an 'activation' airdrop, which sends 1 KIN to a Solana account so that the _KIN Token Account_ will be created.

It should be pretty straightforward to modify this for other airdropping needs.

Make sure to protect your endpoints for malicious users, so they don't drain your _Airdrop Account_.

## Requirements

- Basic Node and TypeScript knowledge
- Node 14 or 16
- Yarn 1.22.x

## Running this project

### 1. Clone the repo

```shell
git clone https://github.com/kin-starters/kin-airdrop-node.git
cd kin-airdrop-node
```

### 2. Install the dependencies

```shell
yarn install
```

### 3. Configure your environment

You need to create the `.env` file and configure the settings. The env var `KIN_AIRDROP_PRIVATE_KEY` is required.

Read the `.env.example` file for configuration options.

```shell
// Or use your editor to copy the file...
cp .env .env.example
```

### 4. Run the server

```shell
yarn dev:server
```

### 5. Invoke the endpoint

You can now invoke the `/airdrop` endpoint on the API, adding the public key of the Solana destination account as a parameter:

```shell
curl http://localhost:7890/airdrop/FaFGzKRFhrQffH7voPUgzpJA2ngsvJvtYPXcye6w4DJ9
```
