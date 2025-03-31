import { ApiConfiguration } from "../../../src/shared/api"
import { AutoApprovalSettings } from "../../../src/shared/AutoApprovalSettings"
import { BrowserSettings } from "../../../src/shared/BrowserSettings"
import { ChatSettings } from "../../../src/shared/ChatSettings"
import { UserInfo } from "../../../src/shared/UserInfo"
import { ChatContent } from "../../../src/shared/ChatContent"
import { TelemetrySetting } from "../../../src/shared/TelemetrySetting"
import { ClineMessage } from "../../../src/shared/ExtensionMessage"

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