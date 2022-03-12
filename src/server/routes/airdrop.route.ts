import { Request, Response } from 'express'
import { KinClient } from '../../lib'

export function airdropRoute({ amount, kin, privateKey }: { amount: string; kin: KinClient; privateKey: string }) {
  return async (req: Request, res: Response) => {
    try {
      return await kin.airdrop({
        amount,
        destination: req.params.destination,
        kin,
        privateKey,
      })
    } catch (error) {
      res.status(400)
      return res.send({ error: `${error}` })
    }
  }
}
