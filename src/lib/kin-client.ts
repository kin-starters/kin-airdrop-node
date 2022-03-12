import {
  Client,
  Commitment,
  Environment,
  kinToQuarks,
  PrivateKey,
  PublicKey,
  quarksToKin,
  TransactionType,
} from '@kinecosystem/kin-sdk-v2'
import { getPublicKey, sleep } from './utils'

export class KinClient {
  readonly client: Client

  constructor(private readonly env: Environment, private readonly appIndex?: number) {
    this.client = new Client(env, { appIndex })
  }

  async airdrop({
    amount,
    destination,
    kin,
    privateKey,
  }: {
    amount: string
    destination: string
    kin: KinClient
    privateKey: string
  }) {
    const destinationPublicKey = getPublicKey(destination)
    const sender = PrivateKey.fromString(privateKey)

    if (!destinationPublicKey) {
      throw new Error(`Error parsing destination address`)
    }

    const existing = await kin.getExisting(destinationPublicKey)

    if (existing && existing !== '0') {
      throw new Error(`Account '${destinationPublicKey.toBase58()}' is already funded: ${existing} Kin`)
    }

    try {
      const tx = await kin.submitPayment({
        amount,
        destination: destinationPublicKey,
        sender,
      })

      return {
        success: true,
        amount,
        destination: destinationPublicKey.toBase58(),
        tx: Buffer.from(tx).toString('hex'),
      }
    } catch (e) {
      throw new Error(`Account '${destinationPublicKey.toBase58()}' something went wrong: ${e}`)
    }
  }

  async createAccount(airdropPrivateKey: PrivateKey): Promise<PublicKey[]> {
    // Create Account
    await this.client.createAccount(airdropPrivateKey)
    // Resolve Token Account
    return this.client.resolveTokenAccounts(airdropPrivateKey.publicKey())
  }

  explorerUrlAddress(publicKey: string, suffix: string = '') {
    const url = `https://explorer.solana.com/address/${publicKey}${suffix}`
    const cluster = '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev'

    return `${url}${this.env === Environment.Test ? cluster : ''}`
  }

  async findOrCreateAirdropAccount(privateKey: string) {
    // Set up Spender PrivateKey
    const pk = PrivateKey.fromString(privateKey!)

    // Set up Spender Public Key
    const publicKey = pk.publicKey()

    console.log(`💧 Airdrop address: ${publicKey.toBase58()}`)
    console.log(`💧 Airdrop account: ${this.explorerUrlAddress(publicKey.toBase58())}`)

    try {
      // We will try to fetch the balance of this account
      const found = await this.getBalance(publicKey)
      const amount = quarksToKin(found)
      console.log(`💧 Airdrop balance: ${amount}`)
      if (amount === '0') {
        console.log(`💧 Airdrop account: Make sure to fund this account with some KIN.`)
      }
    } catch (e) {
      // If the balance can't be found, we want to create it.
      await this.createAccount(pk)
      console.log(`💧 Airdrop account: created!`)

      // Wait a second for the account to be created, then reload this method.
      await sleep(1)
      console.log(`💧 Airdrop account: reloading...`)
      await this.findOrCreateAirdropAccount(privateKey)
    }
  }

  async getBalance(account: PublicKey) {
    return this.client.getBalance(account)
  }

  async getExisting(publicKey: PublicKey) {
    try {
      const existing = await this.getBalance(publicKey)
      return quarksToKin(existing)
    } catch (e) {}
  }

  async resolveTokenAccounts(account: PublicKey) {
    return this.client.resolveTokenAccounts(account)
  }

  async submitPayment({ amount, destination, sender }: { amount: string; destination: PublicKey; sender: PrivateKey }) {
    return this.client.submitPayment(
      {
        sender,
        destination,
        type: TransactionType.None,
        quarks: kinToQuarks(amount),
      },
      Commitment.Single,
      undefined,
      undefined,
      // This SenderCreate option is essential to 'activate' empty accounts.
      true,
    )
  }
}
