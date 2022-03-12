import { PublicKey } from '@kinecosystem/kin-sdk-v2'

export const sleep = (seconds = 1) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

export function getPublicKey(address: string): PublicKey | undefined {
  try {
    return PublicKey.fromBase58(address)
  } catch (_) {
    try {
      return PublicKey.fromString(address)
    } catch (_) {}
  }
}
