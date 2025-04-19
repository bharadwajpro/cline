// Rate limiter utility for API requests and tokens per minute

export type RateLimitResult<T> = { type: "ok"; result: T } | { type: "token_limit_exceeded" } | { type: "waiting" }

export interface RateLimiterOptions {
	requestsPerMinute?: number | null
	tokensPerMinute?: number | null
}

export class RateLimiter {
	private requestsPerMinute: number | null
	private tokensPerMinute: number | null
	private requestTimestamps: number[] = []
	private tokenTimestamps: { ts: number; tokens: number }[] = []

	constructor(options: RateLimiterOptions) {
		this.requestsPerMinute = options.requestsPerMinute && options.requestsPerMinute > 0 ? options.requestsPerMinute : null
		this.tokensPerMinute = options.tokensPerMinute && options.tokensPerMinute > 0 ? options.tokensPerMinute : null
	}

	async wrap<T>(fn: (...args: any[]) => Promise<T>, tokensForRequest: number): Promise<RateLimitResult<T>> {
		const now = Date.now()
		// Clean up old timestamps
		this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < 60_000)
		this.tokenTimestamps = this.tokenTimestamps.filter((entry) => now - entry.ts < 60_000)

		// Token limit check
		if (this.tokensPerMinute && tokensForRequest > this.tokensPerMinute) {
			return { type: "token_limit_exceeded" }
		}

		// Requests per minute check
		if (this.requestsPerMinute && this.requestTimestamps.length >= this.requestsPerMinute) {
			const waitMs = 60_000 - (now - this.requestTimestamps[0])
			if (waitMs > 0) {
				await new Promise((res) => setTimeout(res, waitMs))
				return { type: "waiting" }
			}
		}

		// Tokens per minute check
		if (this.tokensPerMinute) {
			const tokensUsed = this.tokenTimestamps.reduce((sum, entry) => sum + entry.tokens, 0)
			if (tokensUsed + tokensForRequest > this.tokensPerMinute) {
				// Find when enough tokens will be available
				let tokensToRemove = tokensForRequest - (this.tokensPerMinute - tokensUsed)
				let earliestTime = now
				let sumTokens = 0
				for (const entry of this.tokenTimestamps) {
					sumTokens += entry.tokens
					if (sumTokens >= tokensToRemove) {
						earliestTime = entry.ts
						break
					}
				}
				const waitMs = 60_000 - (now - earliestTime)
				if (waitMs > 0) {
					await new Promise((res) => setTimeout(res, waitMs))
					return { type: "waiting" }
				}
			}
		}

		// Record this request
		this.requestTimestamps.push(now)
		if (this.tokensPerMinute) {
			this.tokenTimestamps.push({ ts: now, tokens: tokensForRequest })
		}
		const result = await fn()
		return { type: "ok", result }
	}
}
