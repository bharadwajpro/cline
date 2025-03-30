## ClineProvider Component

The ClineProvider class manages the extension's state, handles communication between the core extension and the webview, and provides various utility functions.

```mermaid
classDiagram
    class ClineProvider {
        +sideBarId: string
        +tabPanelId: string
        -activeInstances: Set<ClineProvider>
        -disposables: vscode.Disposable[]
        -view?: vscode.WebviewView | vscode.WebviewPanel
        -cline?: Cline
        +workspaceTracker?: WorkspaceTracker
        +mcpHub?: McpHub
        +accountService?: ClineAccountService
        -latestAnnouncementId: string

        +constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel)
        +dispose(): Promise<void>
        +handleSignOut(): Promise<void>
        +setUserInfo(info?: { displayName: string | null; email: string | null; photoURL: string | null }): Promise<void>
        +getVisibleInstance(): ClineProvider | undefined
        +resolveWebviewView(webviewView: vscode.WebviewView | vscode.WebviewPanel): Promise<void>
        +initClineWithTask(task?: string, images?: string[]): Promise<void>
        +initClineWithHistoryItem(historyItem: HistoryItem): Promise<void>
        +postMessageToWebview(message: ExtensionMessage): Promise<void>
        -getHtmlContent(webview: vscode.Webview): string
        -getHMRHtmlContent(webview: vscode.Webview): Promise<string>
        -setWebviewMessageListener(webview: vscode.Webview): void
        +updateTelemetrySetting(telemetrySetting: TelemetrySetting): Promise<void>
        +togglePlanActModeWithChatSettings(chatSettings: ChatSettings, chatContent?: ChatContent): Promise<void>
        +cancelTask(): Promise<void>
        +updateCustomInstructions(instructions?: string): Promise<void>
        +updateApiConfiguration(apiConfiguration: ApiConfiguration): Promise<void>
        +getDocumentsPath(): Promise<string>
        +ensureMcpServersDirectoryExists(): Promise<string>
        +ensureSettingsDirectoryExists(): Promise<string>
        -getVsCodeLmModels(): Promise<vscode.LanguageModelChatModel[]>
        async getOllamaModels(baseUrl?: string): Promise<string[]>
        async getLmStudioModels(baseUrl?: string): Promise<string[]>
        +validateAuthState(state: string | null): Promise<boolean>
        +handleAuthCallback(customToken: string, apiKey: string): Promise<void>
        -fetchMcpMarketplaceFromApi(silent: boolean): Promise<McpMarketplaceCatalog | undefined>
        async silentlyRefreshMcpMarketplace(): Promise<void>
        -fetchMcpMarketplace(forceRefresh: boolean): Promise<void>
        -downloadMcp(mcpId: string): Promise<void>
        async readOpenRouterModels(): Promise<Record<string, ModelInfo> | undefined>
        async refreshOpenRouterModels(): Promise<Record<string, ModelInfo>>
        getFileMentionFromPath(filePath: string): string
        async addSelectedCodeToChat(code: string, filePath: string, languageId: string, diagnostics?: vscode.Diagnostic[]): Promise<void>
        async addSelectedTerminalOutputToChat(output: string, terminalName: string): Promise<void>
        async fixWithCline(code: string, filePath: string, languageId: string, diagnostics: vscode.Diagnostic[]): Promise<void>
        convertDiagnosticsToProblemsString(diagnostics: vscode.Diagnostic[]): string
        async getTaskWithId(id: string): Promise<{ historyItem: HistoryItem; taskDirPath: string; apiConversationHistoryFilePath: string; uiMessagesFilePath: string; apiConversationHistory: Anthropic.MessageParam[]; }>
        async showTaskWithId(id: string): Promise<void>
        async exportTaskWithId(id: string): Promise<void>
        async deleteAllTaskHistory(): Promise<void>
        async refreshTotalTasksSize(): Promise<void>
        async deleteTaskWithId(id: string): Promise<void>
        async deleteTaskFromState(id: string): Promise<HistoryItem[]>
        async postStateToWebview(): Promise<void>
        async getStateToPostToWebview(): Promise<ExtensionState>
        async clearTask(): Promise<void>
        async getState(): Promise<{ apiConfiguration: ApiConfiguration; lastShownAnnouncementId: string | undefined; customInstructions: string | undefined; taskHistory: HistoryItem[] | undefined; autoApprovalSettings: AutoApprovalSettings; browserSettings: BrowserSettings; chatSettings: ChatSettings; userInfo: UserInfo | undefined; previousModeApiProvider: ApiProvider | undefined; previousModeModelId: string | undefined; previousModeModelInfo: ModelInfo | undefined; previousModeVsCodeLmModelSelector: vscode.LanguageModelChatSelector | undefined; previousModeThinkingBudgetTokens: number | undefined; mcpMarketplaceEnabled: boolean; telemetrySetting: TelemetrySetting; planActSeparateModelsSetting: boolean | undefined; }>
        async updateTaskHistory(item: HistoryItem): Promise<HistoryItem[]>
        async updateGlobalState(key: GlobalStateKey, value: any): Promise<void>
        async getGlobalState(key: GlobalStateKey): Promise<any>
        -updateWorkspaceState(key: string, value: any): Promise<void>
        -getWorkspaceState(key: string): Promise<any>
        -storeSecret(key: SecretKey, value?: string): Promise<void>
        async getSecret(key: SecretKey): Promise<string | undefined>
        async fetchOpenGraphData(url: string): Promise<void>
        async checkIsImageUrl(url: string): Promise<void>
    }

    note for ClineProvider.sideBarId: The ID of the sidebar view.
    note for ClineProvider.tabPanelId: The ID of the tab panel view.
    note for ClineProvider.activeInstances: A set of active ClineProvider instances.
    note for ClineProvider.disposables: A list of disposables.
    note for ClineProvider.view: The webview view or panel.
    note for ClineProvider.cline: The Cline instance.
    note for ClineProvider.workspaceTracker: Tracks the workspace.
    note for ClineProvider.mcpHub: Manages MCP servers.
    note for ClineProvider.accountService: Manages account-related functionality.
    note for ClineProvider.latestAnnouncementId: The ID of the latest announcement.

    note for ClineProvider.constructor: Initializes a new ClineProvider instance.
    note for ClineProvider.dispose: Disposes of the ClineProvider instance.
    note for ClineProvider.handleSignOut: Handles user sign-out.
    note for ClineProvider.setUserInfo: Sets user information.
    note for ClineProvider.getVisibleInstance: Gets the visible ClineProvider instance.
    note for ClineProvider.resolveWebviewView: Resolves the webview view.
    note for ClineProvider.initClineWithTask: Initializes a new Cline instance with a task.
    note for ClineProvider.initClineWithHistoryItem: Initializes a new Cline instance with a history item.
    note for ClineProvider.postMessageToWebview: Sends a message to the webview.
    note for ClineProvider.getHtmlContent: Gets the HTML content for the webview.
    note for ClineProvider.getHMRHtmlContent: Gets the HTML content for the webview with HMR.
    note for ClineProvider.setWebviewMessageListener: Sets the webview message listener.
    note for ClineProvider.updateTelemetrySetting: Updates the telemetry setting.
    note for ClineProvider.togglePlanActModeWithChatSettings: Toggles plan/act mode with chat settings.
    note for ClineProvider.cancelTask: Cancels the current task.
    note for ClineProvider.updateCustomInstructions: Updates the custom instructions.
    note for ClineProvider.updateApiConfiguration: Updates the API configuration.
    note for ClineProvider.getDocumentsPath: Gets the documents path.
    note for ClineProvider.ensureMcpServersDirectoryExists: Ensures the MCP servers directory exists.
    note for ClineProvider.ensureSettingsDirectoryExists: Ensures the settings directory exists.
    note for ClineProvider.getVsCodeLmModels: Gets the VS Code LM models.
    note for ClineProvider.getOllamaModels: Gets the Ollama models.
    note for ClineProvider.getLmStudioModels: Gets the LM Studio models.
    note for ClineProvider.validateAuthState: Validates the auth state.
    note for ClineProvider.handleAuthCallback: Handles the auth callback.
    note for ClineProvider.fetchMcpMarketplaceFromApi: Fetches the MCP marketplace from the API.
    note for ClineProvider.silentlyRefreshMcpMarketplace: Silently refreshes the MCP marketplace.
    note for ClineProvider.fetchMcpMarketplace: Fetches the MCP marketplace.
    note for ClineProvider.downloadMcp: Downloads an MCP.
    note for ClineProvider.readOpenRouterModels: Reads the OpenRouter models.
    note for ClineProvider.refreshOpenRouterModels: Refreshes the OpenRouter models.
    note for ClineProvider.getFileMentionFromPath: Gets the file mention from the path.
    note for ClineProvider.addSelectedCodeToChat: Adds the selected code to the chat.
    note for ClineProvider.addSelectedTerminalOutputToChat: Adds the selected terminal output to the chat.
    note for ClineProvider.fixWithCline: Fixes the code with Cline.
    note for ClineProvider.convertDiagnosticsToProblemsString: Converts diagnostics to a problems string.
    note for ClineProvider.getTaskWithId: Gets the task with the given ID.
    note for ClineProvider.showTaskWithId: Shows the task with the given ID.
    note for ClineProvider.exportTaskWithId: Exports the task with the given ID.
    note for ClineProvider.deleteAllTaskHistory: Deletes all task history.
    note for ClineProvider.refreshTotalTasksSize: Refreshes the total tasks size.
    note for ClineProvider.deleteTaskWithId: Deletes the task with the given ID.
    note for ClineProvider.deleteTaskFromState: Deletes the task from the state.
    note for ClineProvider.postStateToWebview: Posts the state to the webview.
    note for ClineProvider.getStateToPostToWebview: Gets the state to post to the webview.
    note for ClineProvider.clearTask: Clears the task.
    note for ClineProvider.getState: Gets the state.
    note for ClineProvider.updateTaskHistory: Updates the task history.
    note for ClineProvider.updateGlobalState: Updates the global state.
    note for ClineProvider.getGlobalState: Gets the global state.
    note for ClineProvider.updateWorkspaceState: Updates the workspace state.
    note for ClineProvider.getWorkspaceState: Gets the workspace state.
    note for ClineProvider.storeSecret: Stores a secret.
    note for ClineProvider.getSecret: Gets a secret.
    note for ClineProvider.fetchOpenGraphData: Fetches Open Graph data.
    note for ClineProvider.checkIsImageUrl: Checks if a URL is an image URL.
