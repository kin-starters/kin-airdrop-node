import { Environment } from '@kinecosystem/kin-sdk-v2'

export interface ServerConfig {
  appIndex: number
  amount: string
  env: Environment
  port: string
  airdropPrivateKey: string
}
