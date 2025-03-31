import { ApiConfiguration } from "./api"
import { AutoApprovalSettings } from "./AutoApprovalSettings"
import { BrowserSettings } from "./BrowserSettings"
import { ChatSettings } from "./ChatSettings"
import { UserInfo } from "./UserInfo"
import { ChatContent } from "./ChatContent"
import { TelemetrySetting } from "./TelemetrySetting"
import { ClineMessage } from "./ExtensionMessage"

export type WebviewMessageType =
	| "autoApprovalSettings"
	| "browserSettings"
	| "telemetrySetting"
	| "apiConfiguration"
	| "invoke"
	| "requestVsCodeLmModels"
	| "authCallback"
	| "accountLoginClicked"
	| "accountLogoutClicked"
	| "humanRelayCopyMessage"
	| "humanRelaySubmitResponse"
	| "humanRelayMessageCopied"
	| "humanRelayResponseSubmitted"
	| "humanRelayWaitingForResponse"
	| "error"
	| "authStateChanged"
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
	| "partialMessage"

export interface WebviewMessage {
	type: WebviewMessageType
	text?: string
	response?: string
	images?: string[]
	apiConfiguration?: ApiConfiguration
	autoApprovalSettings?: AutoApprovalSettings
	browserSettings?: BrowserSettings
	chatSettings?: ChatSettings
	chatContent?: ChatContent
	user?: UserInfo | null
	customToken?: string
	url?: string
	planActSeparateModelsSetting?: boolean
	telemetrySetting?: TelemetrySetting
	customInstructionsSetting?: string
	serverName?: string
	toolNames?: string[]
	autoApprove?: boolean
	timeout?: number
	mcpId?: string
	askResponse?: any // TODO: Define ClineAskResponse type
	number?: number
	bool?: boolean
	disabled?: boolean
	commits?: any[] // TODO: Define commit type
	message?: string
	partialMessage?: ClineMessage
}

export interface ClineCheckpointRestore {
	id: string
	timestamp: number
	messages: any[] // TODO: Define message type
	restoreType: "task" | "taskAndWorkspace" | "workspace"
}

export type ClineAskResponse = "yes" | "no" | "cancel" | "yesButtonClicked" | "messageResponse"
