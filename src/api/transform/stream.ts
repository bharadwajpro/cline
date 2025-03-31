export type ApiStream = AsyncGenerator<ApiStreamChunk>
export type ApiStreamChunk = ApiStreamTextChunk | ApiStreamReasoningChunk | ApiStreamUsageChunk | ApiStreamContentChunk

export interface ApiStreamTextChunk {
	type: "text"
	text: string
}

export interface ApiStreamReasoningChunk {
	type: "reasoning"
	reasoning: string
}

export interface ApiStreamUsageChunk {
	type: "usage"
	inputTokens: number
	outputTokens: number
	cacheWriteTokens?: number
	cacheReadTokens?: number
	totalCost?: number // openrouter
}

export interface ApiStreamContentChunk {
	type: "content"
	content: string
}

// Helper class to create a stream that can be controlled externally
export class ControlledApiStream implements AsyncGenerator<ApiStreamChunk> {
	private chunks: ApiStreamChunk[] = []
	private isComplete = false
	private resolveNext: ((value: IteratorResult<ApiStreamChunk>) => void) | null = null
	private rejectNext: ((reason: any) => void) | null = null

	async next(): Promise<IteratorResult<ApiStreamChunk>> {
		if (this.chunks.length > 0) {
			return { done: false, value: this.chunks.shift()! }
		}
		if (this.isComplete) {
			return { done: true, value: undefined }
		}
		return new Promise((resolve, reject) => {
			this.resolveNext = resolve
			this.rejectNext = reject
		})
	}

	async return(): Promise<IteratorResult<ApiStreamChunk>> {
		this.isComplete = true
		if (this.resolveNext) {
			this.resolveNext({ done: true, value: undefined })
		}
		return { done: true, value: undefined }
	}

	async throw(error: any): Promise<IteratorResult<ApiStreamChunk>> {
		if (this.rejectNext) {
			this.rejectNext(error)
		}
		throw error
	}

	[Symbol.asyncIterator](): AsyncGenerator<ApiStreamChunk> {
		return this
	}

	[Symbol.asyncDispose](): Promise<void> {
		return Promise.resolve()
	}

	addChunk(chunk: ApiStreamChunk) {
		this.chunks.push(chunk)
		if (this.resolveNext) {
			this.resolveNext({ done: false, value: this.chunks.shift()! })
		}
	}

	end() {
		this.isComplete = true
		if (this.resolveNext) {
			this.resolveNext({ done: true, value: undefined })
		}
	}
}
