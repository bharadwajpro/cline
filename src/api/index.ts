import { Anthropic } from "@anthropic-ai/sdk"
import { ApiConfiguration, ModelInfo } from "../shared/api"
import { AnthropicHandler } from "./providers/anthropic"
import { AwsBedrockHandler } from "./providers/bedrock"
import { OpenRouterHandler } from "./providers/openrouter"
import { VertexHandler } from "./providers/vertex"
import { OpenAiHandler } from "./providers/openai"
import { OllamaHandler } from "./providers/ollama"
import { LmStudioHandler } from "./providers/lmstudio"
import { GeminiHandler } from "./providers/gemini"
import { OpenAiNativeHandler } from "./providers/openai-native"
import { ApiStream, ApiStreamUsageChunk } from "./transform/stream"
import { DeepSeekHandler } from "./providers/deepseek"
import { RequestyHandler } from "./providers/requesty"
import { TogetherHandler } from "./providers/together"
import { QwenHandler } from "./providers/qwen"
import { MistralHandler } from "./providers/mistral"
import { DoubaoHandler } from "./providers/doubao"
import { VsCodeLmHandler } from "./providers/vscode-lm"
import { ClineHandler } from "./providers/cline"
import { LiteLlmHandler } from "./providers/litellm"
import { AskSageHandler } from "./providers/asksage"
import { XAIHandler } from "./providers/xai"
import { SambanovaHandler } from "./providers/sambanova"
import { RateLimiter } from "./rateLimiter"

export interface ApiHandler {
	createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream
	getModel(): { id: string; info: ModelInfo }
	getApiStreamUsage?(): Promise<ApiStreamUsageChunk | undefined>
}

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export class RateLimitError extends Error {
	constructor(public reason: "token_limit_exceeded" | "waiting") {
		super(reason)
		this.name = "RateLimitError"
	}
}

export function buildApiHandler(
	configuration: ApiConfiguration & {
		rateLimitEnabled?: boolean
		requestsPerMinute?: number | null
		tokensPerMinute?: number | null
	},
	postMessage?: (msg: any) => void,
): ApiHandler {
	const { apiProvider, rateLimitEnabled, requestsPerMinute, tokensPerMinute, ...options } = configuration
	const handler = (() => {
		switch (apiProvider) {
			case "anthropic":
				return new AnthropicHandler(options)
			case "openrouter":
				return new OpenRouterHandler(options)
			case "bedrock":
				return new AwsBedrockHandler(options)
			case "vertex":
				return new VertexHandler(options)
			case "openai":
				return new OpenAiHandler(options)
			case "ollama":
				return new OllamaHandler(options)
			case "lmstudio":
				return new LmStudioHandler(options)
			case "gemini":
				return new GeminiHandler(options)
			case "openai-native":
				return new OpenAiNativeHandler(options)
			case "deepseek":
				return new DeepSeekHandler(options)
			case "requesty":
				return new RequestyHandler(options)
			case "together":
				return new TogetherHandler(options)
			case "qwen":
				return new QwenHandler(options)
			case "doubao":
				return new DoubaoHandler(options)
			case "mistral":
				return new MistralHandler(options)
			case "vscode-lm":
				return new VsCodeLmHandler(options)
			case "cline":
				return new ClineHandler(options)
			case "litellm":
				return new LiteLlmHandler(options)
			case "asksage":
				return new AskSageHandler(options)
			case "xai":
				return new XAIHandler(options)
			case "sambanova":
				return new SambanovaHandler(options)
			default:
				return new AnthropicHandler(options)
		}
	})()

	if (rateLimitEnabled) {
		const limiter = new RateLimiter({ requestsPerMinute, tokensPerMinute })
		const origCreateMessage = handler.createMessage.bind(handler)
		handler.createMessage = (systemPrompt: string, messages: Anthropic.Messages.MessageParam[]) => {
			const tokensForRequest = estimateTokens(systemPrompt, messages)
			let result: any
			const wait = require("deasync").runLoopOnce
			let done = false,
				error: Error | undefined
			limiter
				.wrap(() => Promise.resolve(origCreateMessage(systemPrompt, messages)), tokensForRequest)
				.then((r) => {
					if (r.type === "ok") {
						result = r.result
					} else {
						if (postMessage) {
							postMessage({
								type: "rateLimitStatus",
								status: r.type === "waiting" ? "waiting" : "token_limit_exceeded",
								message:
									r.type === "waiting"
										? "Waiting for rate limit window to reset..."
										: "Current context length exceeds the Tokens Per Minute limit set by the user. Ignoring the Tokens Per Minute Rate Limiter setting",
							})
						}
						error = new RateLimitError(r.type)
					}
					done = true
				})
				.catch((e) => {
					error = e
					done = true
				})
			while (!done) {
				wait()
			}
			if (error) {
				throw error
			}
			return result
		}
	}

	return handler
}

// Simple token estimation (replace with a better one if available)
function estimateTokens(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): number {
	let total = systemPrompt ? systemPrompt.split(/\s+/).length : 0
	for (const msg of messages) {
		const content = (msg as any).content
		if (typeof content === "string") {
			total += content.split(/\s+/).length
		} else if (Array.isArray(content)) {
			for (const part of content) {
				if (typeof part === "string") {
					total += part.split(/\s+/).length
				} else if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
					total += part.text.split(/\s+/).length
				}
			}
		}
	}
	return total
}
