import { Event, EventsHandler } from '@kinecosystem/kin-sdk-v2/dist/webhook'

export function kinEventHook({ secret }: { secret: string }) {
  return EventsHandler((events: Event[]) => {
    for (const e of events) {
      console.log(`EventsHandler: ${e.transaction_event.tx_id}`)
    }
  }, secret)
}
