import { Environment } from '@kinecosystem/kin-sdk-v2'
import express, { json } from 'express'
import { KinClient } from '../lib'
import { airdropRoute } from './routes/airdrop.route'
import { uptimeRoute } from './routes/uptime.route'
import { ServerConfig } from './server-config'

export async function main(config: ServerConfig) {
  // Set up Kin client
  const kin = new KinClient(config.env, config.appIndex)
  console.log(`💧 Kin Environment ${Environment[config.env]} `)

  // Set up Express server
  const app = express()
  app.use(json())

  // Routes
  app.use('/airdrop/:destination', airdropRoute({ amount: config.amount, kin, privateKey: config.airdropPrivateKey }))
  app.use('/', uptimeRoute())

  // Start server
  app.listen(Number(config.port), '0.0.0.0').on('listening', async () => {
    console.log(`💧 Listening on port ${config.port}`)

    // Initialize AirdropAccount
    kin.findOrCreateAirdropAccount(config.airdropPrivateKey).then(() => {
      console.log(`💧 Ready to drop!`)
    })
  })
}
