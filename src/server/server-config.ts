import { Environment } from '@kinecosystem/kin-sdk-v2'

export interface ServerConfig {
  airdropPrivateKey: string
  amount: string
  appIndex: number
  env: Environment
  port: string
  webhookSecret: string
}
