import { Environment } from '@kinecosystem/kin-sdk-v2'
import * as dotenv from 'dotenv'
import { main } from './server/server'
import { ServerConfig } from './server/server-config'

dotenv.config()

const env: Environment = process.env.KIN_ENV?.toLowerCase() === 'prod' ? Environment.Prod : Environment.Test

const config: ServerConfig = {
  // See the file '.env.example' for details about these environment variables.
  airdropPrivateKey: process.env.KIN_AIRDROP_PRIVATE_KEY!,
  amount: process.env.KIN_AIRDROP_AMOUNT || '1',
  env,
  appIndex: Number(process.env.KIN_APP_INDEX),
  port: process.env.PORT || '7890',
  webhookSecret: process.env.KIN_WEBHOOK_SECRET || '',
}

if (!config.airdropPrivateKey) {
  console.error(`Environment variable KIN_AIRDROP_PRIVATE_KEY not found`)
  process.exit(1)
}

main(config).catch((e) => console.error(`An error occurred:`, e))
