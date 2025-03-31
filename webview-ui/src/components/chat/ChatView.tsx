import React, { useCallback, useEffect, useRef, useState } from "react"
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso"
import { vscode } from "../../utils/vscode"
import type { WebviewMessage } from "../../../src/shared/WebviewMessage"
import { Button } from "../ui/Button"
import { IconButton } from "../ui/IconButton"
import CopyIcon from "../icons/CopyIcon"

interface ChatViewProps {
	isHidden: boolean
	showAnnouncement: boolean
	hideAnnouncement: () => void
	showHistoryView: () => void
}

const ScrollToBottomButton = ({ onClick }: { onClick: () => void }) => (
	<Button onClick={onClick} variant="secondary">
		Scroll to Bottom
	</Button>
)

const ChatView = ({ isHidden, showAnnouncement, hideAnnouncement, showHistoryView }: ChatViewProps) => {
	const [inputValue, setInputValue] = useState("")
	const [selectedImages, setSelectedImages] = useState<string[]>([])
	const [isHumanRelayMode, setIsHumanRelayMode] = useState(false)
	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
	const [formattedMessage, setFormattedMessage] = useState("")
	const [telemetrySetting, setTelemetrySetting] = useState<string>("unset")
	const [version, setVersion] = useState<string>("")
	const [isCopying, setIsCopying] = useState(false)
	const [copySuccess, setCopySuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const virtuosoRef = useRef<VirtuosoHandle>(null)
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			if (isHumanRelayMode && isWaitingForResponse) {
				handleSubmitResponse()
			} else {
				handleSendMessage(inputValue, selectedImages)
			}
		}
	}, [inputValue, selectedImages, isHumanRelayMode, isWaitingForResponse])

	const handleSendMessage = useCallback((text: string, images: string[]) => {
		if (!text.trim() && images.length === 0) return
		vscode.postMessage({
			type: "invoke",
			text,
			images,
		} as WebviewMessage)
		setInputValue("")
		setSelectedImages([])
	}, [])

	const handleSubmitResponse = useCallback(() => {
		if (inputValue.trim()) {
			vscode.postMessage({ 
				type: "humanRelaySubmitResponse",
				response: inputValue.trim()
			} as WebviewMessage)
			setInputValue("")
		}
	}, [inputValue])

	const handleCopyMessage = useCallback(async () => {
		setIsCopying(true)
		vscode.postMessage({ type: "humanRelayCopyMessage" } as WebviewMessage)
	}, [])

	const handlePrimaryButtonClick = useCallback((text: string, images: string[]) => {
		vscode.postMessage({
			type: "invoke",
			text,
			images,
		} as WebviewMessage)
	}, [])

	const handleSecondaryButtonClick = useCallback((text: string, images: string[]) => {
		vscode.postMessage({
			type: "invoke",
			text,
			images,
		} as WebviewMessage)
	}, [])

	const scrollToBottomAuto = useCallback(() => {
		if (virtuosoRef.current) {
			virtuosoRef.current.scrollToIndex({
				index: "LAST",
				behavior: "smooth",
			})
		}
	}, [])

	useEffect(() => {
		const handleMessage = (e: MessageEvent) => {
			const message = e.data as WebviewMessage
			switch (message.type) {
				case "humanRelayWaitingForResponse":
					setIsHumanRelayMode(true)
					setIsWaitingForResponse(true)
					setFormattedMessage(message.text || "")
					break
				case "humanRelayMessageCopied":
					setCopySuccess(true)
					setIsCopying(false)
					setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
					break
				case "humanRelayResponseSubmitted":
					setIsHumanRelayMode(false)
					setIsWaitingForResponse(false)
					setFormattedMessage("")
					break
				case "error":
					setErrorMessage(message.text || "An error occurred")
					setTimeout(() => setErrorMessage(null), 5000) // Clear error after 5 seconds
					break
				case "telemetrySetting":
					if (message.telemetrySetting) {
						setTelemetrySetting(message.telemetrySetting)
					}
					break
				case "webviewDidLaunch":
					if (message.message) {
						setVersion(message.message)
					}
					break
				case "invoke":
					// Handle invoke messages
					break
				default:
					// Handle other message types
					break
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	return (
		<div className="flex flex-col h-full">
			{errorMessage && (
				<div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg m-4">
					{errorMessage}
				</div>
			)}
			<div className="flex-1 overflow-y-auto">
				{/* ... existing message list ... */}
				{isHumanRelayMode && isWaitingForResponse && (
					<div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg m-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-lg font-semibold">Human Relay Mode</h3>
							<div className="flex items-center space-x-2">
								{copySuccess && (
									<span className="text-sm text-green-600 dark:text-green-400">
										Copied to clipboard!
									</span>
								)}
								<IconButton
									onClick={handleCopyMessage}
									icon={<CopyIcon />}
									tooltip="Copy message"
									className={`${copySuccess ? "text-green-600 dark:text-green-400" : ""} ${isCopying ? "opacity-50" : ""}`}
									disabled={isCopying}
								/>
							</div>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
							Please copy the message above and paste it into your external LLM interface.
							Once you have the response, paste it in the input box below and click Submit.
						</p>
						<div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
							<pre className="whitespace-pre-wrap text-sm font-mono">{formattedMessage}</pre>
						</div>
					</div>
				)}
			</div>
			<div className="flex-shrink-0 p-4 border-t dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<textarea
						ref={textAreaRef}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isHumanRelayMode && isWaitingForResponse}
						placeholder={isHumanRelayMode && isWaitingForResponse 
							? "Paste the LLM response here..."
							: "Type your message here..."}
						className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<Button
						onClick={() => {
							if (isHumanRelayMode && isWaitingForResponse) {
								handleSubmitResponse()
							} else {
								handleSendMessage(inputValue, selectedImages)
							}
						}}
						disabled={isHumanRelayMode && isWaitingForResponse && !inputValue.trim()}
						className="disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isHumanRelayMode && isWaitingForResponse ? "Submit Response" : "Send"}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ChatView
