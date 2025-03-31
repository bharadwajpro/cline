import { ApiStream } from "../api/transform/stream"

export interface HumanRelayState {
    isWaitingForResponse: boolean
    formattedMessage: string
    currentStream: ApiStream | null
}

export type HumanRelayMessageType =
    | "humanRelayCopyMessage"
    | "humanRelaySubmitResponse"
    | "humanRelayMessageCopied"
    | "humanRelayResponseSubmitted"
    | "humanRelayWaitingForResponse"

export interface HumanRelayMessage {
    type: HumanRelayMessageType
    text?: string
    response?: string
} 