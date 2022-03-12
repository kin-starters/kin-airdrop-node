import { Environment } from '@kinecosystem/kin-sdk-v2'
import express, { json } from 'express'
import { KinClient } from '../lib'
import { kinEventHook } from './hooks/kin-event.hook'
import { kinSignTransactionHook } from './hooks/kin-sign-transaction.hook'
import { airdropRoute } from './routes/airdrop.route'
import { uptimeRoute } from './routes/uptime.route'
import { ServerConfig } from './server-config'

export async function main(config: ServerConfig) {
  // Set up Kin client
  const kin = new KinClient(config.env, config.appIndex)
  console.log(
    `💧 Kin Environment ${Environment[config.env]} ${
      config.appIndex ? `with appIndex ${config.appIndex}` : 'without appIndex'
    }`,
  )

  // Set up Express server
  const app = express()
  app.use(json())

  // Airdrop Route
  app.use('/airdrop/:destination', airdropRoute({ amount: config.amount, kin, privateKey: config.airdropPrivateKey }))
  // Webhook Routes
  app.use('/hooks/events', kinEventHook({ secret: config.webhookSecret }))
  app.use('/hooks/sign-transaction', kinSignTransactionHook({ env: config.env, secret: config.webhookSecret }))
  // Root Route, must be the last one.
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
