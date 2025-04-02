import { Anthropic } from "@anthropic-ai/sdk"
import { ApiHandler } from "../"
import { ApiHandlerOptions, ModelInfo } from "../../shared/api"
import { ApiStream, ApiStreamTextChunk } from "../transform/stream"
import { ExtensionMessage, ClineMessage } from "../../shared/ExtensionMessage"

export class HumanRelayHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private messageHandler: ((message: any) => void) | null = null

	constructor(options: ApiHandlerOptions) {
		this.options = options
	}

	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		// Format the message for the user to copy
		const formattedMessage = this.formatMessage(systemPrompt, messages)

		// Send the formatted message to the webview first
		this.postMessage({
			type: "relayMessage",
			text: formattedMessage,
		})

		// Add a small delay to ensure the relay message is processed
		await new Promise((resolve) => setTimeout(resolve, 100))

		// Send API request started message to clear loading state
		const apiReqStarted: ClineMessage = {
			ts: Date.now(),
			type: "say",
			say: "api_req_started",
			text: JSON.stringify({ cost: 0 }),
		}
		this.postMessage(apiReqStarted)

		// Wait for user response
		const response = await this.handleResponse()

		// Send API request finished message
		const apiReqFinished: ClineMessage = {
			ts: Date.now(),
			type: "say",
			say: "api_req_finished",
			text: JSON.stringify({ cost: 0 }),
		}
		this.postMessage(apiReqFinished)

		// Send the response back to the webview
		this.postMessage({
			type: "relayResponse",
			text: response,
		})

		// Yield the response as a text chunk
		yield {
			type: "text",
			text: response,
		} as ApiStreamTextChunk
	}

	getModel(): { id: string; info: ModelInfo } {
		return {
			id: "human-relay",
			info: {
				maxTokens: 0,
				contextWindow: 0,
				supportsImages: false,
				supportsComputerUse: false,
				supportsPromptCache: false,
			},
		}
	}

	private formatMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): string {
		let formattedMessage = "System Prompt:\n" + systemPrompt + "\n\nConversation:\n"

		messages.forEach((msg) => {
			const role = msg.role === "user" ? "User" : "Assistant"
			formattedMessage += `${role}: ${msg.content}\n\n`
		})

		return formattedMessage
	}

	private postMessage(message: ExtensionMessage | ClineMessage) {
		if (this.options.postMessage) {
			this.options.postMessage(message)
		}
	}

	private async handleResponse(): Promise<string> {
		return new Promise((resolve) => {
			this.messageHandler = (message: any) => {
				if (message.type === "askResponse") {
					if (this.options.onMessage) {
						this.options.onMessage(null) // Remove the message handler
					}
					this.messageHandler = null
					resolve(message.text || "")
				}
			}

			if (this.options.onMessage) {
				this.options.onMessage(this.messageHandler)
			}
		})
	}
}
