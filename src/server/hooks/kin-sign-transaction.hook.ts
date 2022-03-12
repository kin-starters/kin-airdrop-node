import { Environment, quarksToKin } from '@kinecosystem/kin-sdk-v2'
import {
  SignTransactionHandler,
  SignTransactionRequest,
  SignTransactionResponse,
} from '@kinecosystem/kin-sdk-v2/dist/webhook'
import bs58 from 'bs58'

export function kinSignTransactionHook({ env, secret }: { env: Environment; secret: string }) {
  return SignTransactionHandler(
    env,
    (req: SignTransactionRequest, resp: SignTransactionResponse) => {
      console.log(`SignTransactionHandler: ${bs58.encode(req.txId()!)}`)

      for (const creation of req.creations) {
        console.log(`SignTransactionHandler: create ${creation.owner.toBase58()} -> ${creation.address.toBase58()}`)
      }

      for (const payment of req.payments) {
        console.log(
          `SignTransactionHandler: payment ${payment.sender.toBase58()} -> ${payment.destination.toBase58()} ${quarksToKin(
            payment.quarks,
          )}`,
        )
      }
      // If you want to reject the transaction, call `resp.reject()` based on your condition
      // If you return nothing, the webhook returns an HTTP 200 and will be accepted by Agora.
    },
    secret,
  )
}
