## Cline Component

The Cline class is the heart of the extension, managing task execution, state persistence, and tool coordination. Each task runs in its own instance of the Cline class, ensuring isolation and proper state management.

```mermaid
classDiagram
    class Cline {
        +taskId: string
        +apiProvider?: string
        +api: ApiHandler
        -terminalManager: TerminalManager
        -urlContentFetcher: UrlContentFetcher
        +browserSession: BrowserSession
        +contextManager: ContextManager
        -didEditFile: boolean
        +customInstructions?: string
        +autoApprovalSettings: AutoApprovalSettings
        -browserSettings: BrowserSettings
        -chatSettings: ChatSettings
        +apiConversationHistory: Anthropic.MessageParam[]
        +clineMessages: ClineMessage[]
        -clineIgnoreController: ClineIgnoreController
        -askResponse?: ClineAskResponse
        -askResponseText?: string
        -askResponseImages?: string[]
        -lastMessageTs?: number
        -consecutiveAutoApprovedRequestsCount: number
        -consecutiveMistakeCount: number
        -providerRef: WeakRef<ClineProvider>
        -abort: boolean
        +didFinishAbortingStream: boolean
        +abandoned: boolean
        -diffViewProvider: DiffViewProvider
        -checkpointTracker?: CheckpointTracker
        +checkpointTrackerErrorMessage?: string
        +conversationHistoryDeletedRange?: [number, number]
        +isInitialized: boolean
        +isAwaitingPlanResponse: boolean
        +didRespondToPlanAskBySwitchingMode: boolean
        -isWaitingForFirstChunk: boolean
        -isStreaming: boolean
        -currentStreamingContentIndex: number
        -assistantMessageContent: AssistantMessageContent[]
        -presentAssistantMessageLocked: boolean
        -presentAssistantMessageHasPendingUpdates: boolean
        -userMessageContent: (Anthropic.TextBlockParam | Anthropic.ImageBlockParam)[]
        -userMessageContentReady: boolean
        -didRejectTool: boolean
        -didAlreadyUseTool: boolean
        -didCompleteReadingStream: boolean
        -didAutomaticallyRetryFailedApiRequest: boolean

        +constructor(provider: ClineProvider, apiConfiguration: ApiConfiguration, autoApprovalSettings: AutoApprovalSettings, browserSettings: BrowserSettings, chatSettings: ChatSettings, customInstructions?: string, task?: string, images?: string[], historyItem?: HistoryItem)
        +updateBrowserSettings(browserSettings: BrowserSettings): void
        +updateChatSettings(chatSettings: ChatSettings): void
        -ensureTaskDirectoryExists(): Promise<string>
        -getSavedApiConversationHistory(): Promise<Anthropic.MessageParam[]>
        -addToApiConversationHistory(message: Anthropic.MessageParam): void
        -overwriteApiConversationHistory(newHistory: Anthropic.MessageParam[]): void
        -saveApiConversationHistory(): void
        -getSavedClineMessages(): Promise<ClineMessage[]>
        -addToClineMessages(message: ClineMessage): void
        -overwriteClineMessages(newMessages: ClineMessage[]): void
        -saveClineMessages(): void
        +restoreCheckpoint(messageTs: number, restoreType: ClineCheckpointRestore): void
        +presentMultifileDiff(messageTs: number, seeNewChangesSinceLastTaskCompletion: boolean): void
        +doesLatestTaskCompletionHaveNewChanges(): boolean
        +ask(type: ClineAsk, text?: string, partial?: boolean): Promise<{response: ClineAskResponse, text?: string, images?: string[]}>
        +handleWebviewAskResponse(askResponse: ClineAskResponse, text?: string, images?: string[]): void
        +say(type: ClineSay, text?: string, images?: string[], partial?: boolean): Promise<undefined>
        +sayAndCreateMissingParamError(toolName: ToolUseName, paramName: string, relPath?: string): Promise<ToolResponse>
        +removeLastPartialMessageIfExistsWithType(type: "ask" | "say", askOrSay: ClineAsk | ClineSay): Promise<void>
        -startTask(task?: string, images?: string[]): Promise<void>
        -resumeTaskFromHistory(): Promise<void>
        -initiateTaskLoop(userContent: UserContent, isNewTask: boolean): Promise<void>
        +abortTask(): void
        +saveCheckpoint(isAttemptCompletionMessage: boolean): Promise<void>
        +executeCommandTool(command: string): Promise<[boolean, ToolResponse]>
        +shouldAutoApproveTool(toolName: ToolUseName): boolean
        -formatErrorWithStatusCode(error: any): string
        +attemptApiRequest(previousApiReqIndex: number): AsyncGenerator<any, void, unknown>
        +presentAssistantMessage(): Promise<void>
        +recursivelyMakeClineRequests(userContent: UserContent, includeFileDetails: boolean, isNewTask: boolean): Promise<boolean>
        +loadContext(userContent: UserContent, includeFileDetails: boolean): Promise<[Anthropic.ContentBlockParam[], string]>
        +getEnvironmentDetails(includeFileDetails: boolean): Promise<string>
    }

    note for Cline.taskId: Unique identifier for the task.
    note for Cline.apiProvider: The API provider being used (e.g., "openai", "anthropic").
    note for Cline.api: The API handler instance.
    note for Cline.terminalManager: Manages terminal instances.
    note for Cline.urlContentFetcher: Fetches content from URLs.
    note for Cline.browserSession: Manages browser automation.
    note for Cline.contextManager: Manages the context of the conversation.
    note for Cline.didEditFile: Flag indicating if a file was edited.
    note for Cline.customInstructions: Custom instructions provided by the user.
    note for Cline.autoApprovalSettings: Settings for auto-approving tool uses.
    note for Cline.browserSettings: Settings for browser automation.
    note for Cline.chatSettings: Settings for the chat interface.
    note for Cline.apiConversationHistory: History of API conversations.
    note for Cline.clineMessages: List of Cline messages.
    note for Cline.clineIgnoreController: Handles .clineignore file.
    note for Cline.askResponse: The response to a Cline ask.
    note for Cline.askResponseText: The text response to a Cline ask.
    note for Cline.askResponseImages: The image responses to a Cline ask.
    note for Cline.lastMessageTs: Timestamp of the last message.
    note for Cline.consecutiveAutoApprovedRequestsCount: Number of consecutive auto-approved requests.
    note for Cline.consecutiveMistakeCount: Number of consecutive mistakes.
    note for Cline.providerRef: Weak reference to the ClineProvider.
    note for Cline.abort: Flag indicating if the task was aborted.
    note for Cline.didFinishAbortingStream: Flag indicating if the stream was aborted.
    note for Cline.abandoned: Flag indicating if the task was abandoned.
    note for Cline.diffViewProvider: Provides diff view functionality.
    note for Cline.checkpointTracker: Tracks checkpoints.
    note for Cline.checkpointTrackerErrorMessage: Error message for checkpoint tracker.
    note for Cline.conversationHistoryDeletedRange: Range of deleted conversation history.
    note for Cline.isInitialized: Flag indicating if the task is initialized.
    note for Cline.isAwaitingPlanResponse: Flag indicating if the task is awaiting a plan response.
    note for Cline.didRespondToPlanAskBySwitchingMode: Flag indicating if the task responded to a plan ask by switching modes.
    note for Cline.isWaitingForFirstChunk: Flag indicating if the task is waiting for the first chunk.
    note for Cline.isStreaming: Flag indicating if the task is streaming.
    note for Cline.currentStreamingContentIndex: The current streaming content index.
    note for Cline.assistantMessageContent: The assistant message content.
    note for Cline.presentAssistantMessageLocked: Flag indicating if the present assistant message is locked.
    note for Cline.presentAssistantMessageHasPendingUpdates: Flag indicating if the present assistant message has pending updates.
    note for Cline.userMessageContent: The user message content.
    note for Cline.userMessageContentReady: Flag indicating if the user message content is ready.
    note for Cline.didRejectTool: Flag indicating if the tool was rejected.
    note for Cline.didAlreadyUseTool: Flag indicating if the tool was already used.
    note for Cline.didCompleteReadingStream: Flag indicating if the stream was completed.
    note for Cline.didAutomaticallyRetryFailedApiRequest: Flag indicating if the task automatically retried a failed API request.

    note for Cline.constructor: Initializes a new Cline instance.
    note for Cline.updateBrowserSettings: Updates the browser settings.
    note for Cline.updateChatSettings: Updates the chat settings.
    note for Cline.ensureTaskDirectoryExists: Ensures the task directory exists.
    note for Cline.getSavedApiConversationHistory: Gets the saved API conversation history.
    note for Cline.addToApiConversationHistory: Adds a message to the API conversation history.
    note for Cline.overwriteApiConversationHistory: Overwrites the API conversation history.
    note for Cline.saveApiConversationHistory: Saves the API conversation history.
    note for Cline.getSavedClineMessages: Gets the saved Cline messages.
    note for Cline.addToClineMessages: Adds a message to the Cline messages.
    note for Cline.overwriteClineMessages: Overwrites the Cline messages.
    note for Cline.saveClineMessages: Saves the Cline messages.
    note for Cline.restoreCheckpoint: Restores the task to a checkpoint.
    note for Cline.presentMultifileDiff: Presents a multi-file diff.
    note for Cline.doesLatestTaskCompletionHaveNewChanges: Checks if the latest task completion has new changes.
    note for Cline.ask: Asks a question to the user.
    note for Cline.handleWebviewAskResponse: Handles the webview ask response.
    note for Cline.say: Sends a message to the user.
    note for Cline.sayAndCreateMissingParamError: Sends a message and creates a missing parameter error.
    note for Cline.removeLastPartialMessageIfExistsWithType: Removes the last partial message if it exists with the given type.
    note for Cline.startTask: Starts a new task.
    note for Cline.resumeTaskFromHistory: Resumes a task from history.
    note for Cline.initiateTaskLoop: Initiates the task loop.
    note for Cline.abortTask: Aborts the task.
    note for Cline.saveCheckpoint: Saves a checkpoint.
    note for Cline.executeCommandTool: Executes a command tool.
    note for Cline.shouldAutoApproveTool: Checks if a tool should be auto-approved.
    note for Cline.formatErrorWithStatusCode: Formats an error with a status code.
    note for Cline.attemptApiRequest: Attempts an API request.
    note for Cline.presentAssistantMessage: Presents the assistant message.
    note for Cline.recursivelyMakeClineRequests: Recursively makes Cline requests.
    note for Cline.loadContext: Loads the context.
    note for Cline.getEnvironmentDetails: Gets the environment details.
