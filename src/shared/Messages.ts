import { ApiConfiguration, ModelInfo } from "./api"
import { AutoApprovalSettings } from "./AutoApprovalSettings"
import { BrowserSettings } from "./BrowserSettings"
import { ChatSettings } from "./ChatSettings"
import { ChatContent } from "./ChatContent"
import { UserInfo } from "./UserInfo"
import { TelemetrySetting } from "./TelemetrySetting"
import { McpServer, McpMarketplaceCatalog, McpDownloadResponse } from "./mcp"
import { GitCommit } from "../utils/git"
import { BalanceResponse, UsageTransaction, PaymentTransaction } from "./ClineAccount"
import { HistoryItem } from "./HistoryItem"

export type MessageType =
    | "action"
    | "state"
    | "selectedImages"
    | "ollamaModels"
    | "lmStudioModels"
    | "theme"
    | "workspaceUpdated"
    | "invoke"
    | "partialMessage"
    | "openRouterModels"
    | "openAiModels"
    | "mcpServers"
    | "relinquishControl"
    | "vsCodeLmModels"
    | "requestVsCodeLmModels"
    | "authCallback"
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
    | "humanRelayCopyMessage"
    | "humanRelaySubmitResponse"
    | "humanRelayMessageCopied"
    | "humanRelayResponseSubmitted"
    | "humanRelayWaitingForResponse"
    | "error"
    | "fetchUserCreditsData"
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

export type ActionType =
    | "chatButtonClicked"
    | "mcpButtonClicked"
    | "settingsButtonClicked"
    | "historyButtonClicked"
    | "didBecomeVisible"
    | "accountLoginClicked"
    | "accountLogoutClicked"
    | "accountButtonClicked"

export type Invoke = "sendMessage" | "primaryButtonClick" | "secondaryButtonClick"

export interface Message {
    type: MessageType
    text?: string
    action?: ActionType
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
    mcpMarketplaceCatalog?: McpMarketplaceCatalog
    error?: string
    mcpDownloadDetails?: McpDownloadResponse
    commits?: GitCommit[]
    openGraphData?: {
        title?: string
        description?: string
        image?: string
        url?: string
        siteName?: string
        type?: string
    }
    url?: string
    isImage?: boolean
    userCreditsBalance?: BalanceResponse
    userCreditsUsage?: UsageTransaction[]
    userCreditsPayments?: PaymentTransaction[]
    totalTasksSize?: number | null
    response?: string
    bool?: boolean
    disabled?: boolean
}

export interface ExtensionState {
    apiConfiguration?: ApiConfiguration
    autoApprovalSettings: AutoApprovalSettings
    browserSettings: BrowserSettings
    chatSettings: ChatSettings
    checkpointTrackerErrorMessage?: string
    clineMessages: ClineMessage[]
    currentTaskItem?: HistoryItem
    customInstructions?: string
    mcpMarketplaceEnabled?: boolean
    planActSeparateModelsSetting: boolean
    platform: Platform
    shouldShowAnnouncement: boolean
    taskHistory: HistoryItem[]
    telemetrySetting: TelemetrySetting
    uriScheme?: string
    userInfo?: {
        displayName: string | null
        email: string | null
        photoURL: string | null
    }
    version: string
    vscMachineId: string
}

export type Platform = "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32" | "unknown"

export interface ClineMessage {
    ts: number
    type: "ask" | "say"
    ask?: ClineAsk
    say?: ClineSay
    text?: string
    reasoning?: string
    images?: string[]
    partial?: boolean
    lastCheckpointHash?: string
    isCheckpointCheckedOut?: boolean
    conversationHistoryIndex?: number
    conversationHistoryDeletedRange?: [number, number]
}

export type ClineAsk =
    | "followup"
    | "plan_mode_respond"
    | "command"
    | "command_output"
    | "completion_result"
    | "tool"
    | "api_req_failed"
    | "resume_task"
    | "resume_completed_task"
    | "mistake_limit_reached"
    | "auto_approval_max_req_reached"
    | "browser_action_launch"
    | "use_mcp_server"

export type ClineSay =
    | "task"
    | "error"
    | "api_req_started"
    | "api_req_finished"
    | "text"
    | "reasoning"
    | "completion_result"
    | "user_feedback"
    | "user_feedback_diff"
    | "api_req_retried"
    | "command"
    | "command_output"
    | "tool"
    | "shell_integration_warning"
    | "browser_action_launch"
    | "browser_action"
    | "browser_action_result"
    | "mcp_server_request_started"
    | "mcp_server_response"
    | "use_mcp_server"
    | "diff_error"
    | "deleted_api_reqs"
    | "clineignore_error"
    | "checkpoint_created"

export interface ClineCheckpointRestore {
    id: string
    timestamp: number
    messages: any[] // TODO: Define message type
} 