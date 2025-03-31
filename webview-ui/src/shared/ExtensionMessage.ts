import { ModelInfo } from "../../../src/shared/api"
import { McpServer } from "../../../src/shared/mcp"
import { ClineMessage } from "../../../src/shared/ExtensionMessage"

export type Invoke = "sendMessage" | "primaryButtonClick" | "secondaryButtonClick"

export interface ExtensionState {
	apiConfiguration?: {
		apiProvider?: string
		apiKey?: string
		apiModelId?: string
		// ... other configuration properties
	}
	// ... other state properties
}

export type ExtensionMessage = {
	type:
		| "selectedImages"
		| "requestVsCodeLmModels"
		| "authCallback"
		| "invoke"
		| "action"
		| "state"
		| "ollamaModels"
		| "lmStudioModels"
		| "theme"
		| "workspaceUpdated"
		| "partialMessage"
		| "humanRelayWaitingForResponse"
		| "humanRelayMessageCopied"
		| "humanRelayResponseSubmitted"
		| "openRouterModels"
		| "openAiModels"
		| "mcpServers"
		| "relinquishControl"
		| "mcpMarketplaceCatalog"
		| "mcpDownloadDetails"
		| "commitSearchResults"
		| "openGraphData"
		| "isImageUrlResult"
		| "didUpdateSettings"
		| "userCreditsBalance"
		| "userCreditsUsage"
		| "userCreditsPayments"
		| "totalTasksSize"
		| "addToInput"
		| "accountLoginClicked"
		| "accountLogoutClicked"
		| "accountButtonClicked"
		| "autoApprovalSettings"
		| "browserSettings"
		| "telemetrySetting"
		| "apiConfiguration"
		| "webviewDidLaunch"
		| "newTask"
		| "askResponse"
		| "clearTask"
		| "didShowAnnouncement"
		| "selectImages"
		| "exportCurrentTask"
		| "showTaskWithId"
		| "deleteTaskWithId"
		| "exportTaskWithId"
		| "resetState"
		| "requestOllamaModels"
		| "requestLmStudioModels"
		| "openImage"
		| "openInBrowser"
		| "openFile"
		| "openMention"
		| "cancelTask"
		| "refreshOpenRouterModels"
		| "refreshOpenAiModels"
		| "openMcpSettings"
		| "restartMcpServer"
		| "deleteMcpServer"
		| "togglePlanActMode"
		| "checkpointDiff"
		| "checkpointRestore"
		| "taskCompletionViewChanges"
		| "openExtensionSettings"
		| "toggleToolAutoApprove"
		| "toggleMcpServer"
		| "getLatestState"
		| "fetchMcpMarketplace"
		| "downloadMcp"
		| "silentlyRefreshMcpMarketplace"
		| "searchCommits"
		| "showMcpView"
		| "fetchLatestMcpServersFromHub"
		| "openSettings"
		| "updateMcpTimeout"
		| "fetchOpenGraphData"
		| "checkIsImageUrl"
		| "updateSettings"
		| "clearAllTaskHistory"
		| "requestTotalTasksSize"
		| "optionsResponse"
		| "showAccountViewClicked"
		| "fetchUserCreditsData"
	text?: string
	action?: "chatButtonClicked" | "mcpButtonClicked" | "settingsButtonClicked" | "historyButtonClicked" | "didBecomeVisible"
	invoke?: Invoke
	state?: ExtensionState
	images?: string[]
	ollamaModels?: string[]
	lmStudioModels?: string[]
	vsCodeLmModels?: { vendor?: string; family?: string; version?: string; id?: string }[]
	filePaths?: string[]
	partialMessage?: ClineMessage
	openRouterModels?: Record<string, ModelInfo>
	openAiModels?: string[]
	mcpServers?: McpServer[]
	customToken?: string
	bool?: boolean
	disabled?: boolean
	response?: string
	message?: string
	commits?: any[] // TODO: Define commit type
}
