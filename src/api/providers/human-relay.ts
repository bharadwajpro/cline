import { Anthropic } from "@anthropic-ai/sdk"
import { ApiHandler } from "../index"
import { ApiStream, ControlledApiStream } from "../transform/stream"
import { ModelInfo, ApiHandlerOptions } from "../../shared/api"

export class HumanRelayError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "HumanRelayError"
    }
}

export class HumanRelayHandler implements ApiHandler {
    private options: ApiHandlerOptions
    private isWaitingForResponse: boolean = false
    private currentStream: ControlledApiStream | null = null

    constructor(options: ApiHandlerOptions) {
        this.options = options
    }

    createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
        if (!systemPrompt || !messages || messages.length === 0) {
            throw new HumanRelayError("Invalid message parameters: system prompt and messages are required")
        }

        // Format the message for the user to copy
        const formattedMessage = this.formatMessageForCopy(systemPrompt, messages)
        
        // Create a stream that will be controlled by the user
        this.currentStream = new ControlledApiStream()
        
        // Set waiting state
        this.isWaitingForResponse = true
        
        // Return the stream - the actual response will be added when user pastes it back
        return this.currentStream
    }

    getModel(): { id: string; info: ModelInfo } {
        return {
            id: "human-relay",
            info: {
                contextWindow: 0, // Not applicable
                maxTokens: 0, // Not applicable
                supportsImages: false,
                supportsComputerUse: false,
                supportsPromptCache: false,
                inputPrice: 0,
                outputPrice: 0,
                description: "Manual relay through external LLM interface"
            }
        }
    }

    private formatMessageForCopy(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): string {
        let formattedMessage = `System: ${systemPrompt}\n\n`
        
        for (const msg of messages) {
            if (!msg.role || !msg.content) {
                throw new HumanRelayError("Invalid message format: role and content are required")
            }
            formattedMessage += `${msg.role}: ${msg.content}\n\n`
        }
        
        return formattedMessage.trim()
    }

    // Method to be called when user pastes back the LLM response
    public handleUserResponse(response: string) {
        if (!response || typeof response !== "string") {
            throw new HumanRelayError("Invalid response: response must be a non-empty string")
        }

        if (!this.isWaitingForResponse || !this.currentStream) {
            throw new HumanRelayError("Not waiting for user response or stream not initialized")
        }

        try {
            // Add the response to the stream
            this.currentStream.addChunk({
                type: "content",
                content: response
            })

            // Mark stream as complete
            this.currentStream.end()

            // Reset waiting state
            this.isWaitingForResponse = false
            this.currentStream = null
        } catch (error) {
            throw new HumanRelayError(`Failed to process user response: ${error.message}`)
        }
    }

    public isWaitingForUserResponse(): boolean {
        return this.isWaitingForResponse
    }

    public getCurrentStream(): ControlledApiStream | null {
        return this.currentStream
    }
} 