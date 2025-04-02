# Adding a New Provider to Cline

This guide provides step-by-step instructions for adding a new AI provider to Cline. We'll walk through the entire process from initial setup to testing and documentation.

## Prerequisites

Before starting, ensure you have:
- A development environment set up for Cline
- Understanding of the provider's API you want to integrate
- API documentation and authentication requirements
- TypeScript knowledge

## Step 1: Create Provider Files

1. Create a new file in `src/api/providers` directory:
```bash
touch src/api/providers/your-provider.ts
```

2. Create a types file if needed:
```bash
touch src/api/providers/types/your-provider-types.ts
```

## Step 2: Implement Provider Interface

1. Create the basic provider class structure:

```typescript
// src/api/providers/your-provider.ts
import { ApiHandler, ApiRequestOptions, ApiStream } from "../types"
import { YourProviderConfig } from "./types/your-provider-types"

export class YourProviderHandler implements ApiHandler {
    private options: ApiHandlerOptions
    private client: YourProviderClient

    constructor(options: ApiHandlerOptions) {
        this.options = options
        this.client = new YourProviderClient({
            apiKey: options.apiKey,
            // Add other configuration options
        })
    }

    // Required methods
    async generateStream(options: ApiRequestOptions): Promise<ApiStream> {
        // Implementation
    }

    async validateApiKey(apiKey: string): Promise<boolean> {
        // Implementation
    }

    // Optional capabilities
    supportsImages?: boolean = false
    supportsFunctions?: boolean = true
}
```

2. Define provider-specific types:

```typescript
// src/api/providers/types/your-provider-types.ts
export interface YourProviderConfig {
    apiKey: string
    model?: string
    // Add other configuration options
}

export interface YourProviderResponse {
    // Define response structure
}
```

## Step 3: Implement Stream Generation

1. Create the stream generation logic:

```typescript
async generateStream(options: ApiRequestOptions): Promise<ApiStream> {
    try {
        // 1. Prepare the request
        const request = this.prepareRequest(options)

        // 2. Make the API call
        const response = await this.client.createCompletion(request)

        // 3. Create and return the stream
        return new ApiStream({
            start: async () => {
                for await (const chunk of response) {
                    // Process and emit chunks
                    this.processChunk(chunk)
                }
            },
            stop: () => {
                // Implement stream stopping
                response.cancel()
            }
        })
    } catch (error) {
        // Handle errors appropriately
        throw this.handleError(error)
    }
}

private prepareRequest(options: ApiRequestOptions) {
    return {
        messages: this.formatMessages(options.messages),
        model: this.options.model,
        stream: true,
        // Add other request parameters
    }
}
```

## Step 4: Implement Message Processing

1. Add message formatting:

```typescript
private formatMessages(messages: ApiMessage[]): YourProviderMessage[] {
    return messages.map(message => ({
        role: this.mapRole(message.role),
        content: this.formatContent(message.content),
        // Map other message properties
    }))
}

private mapRole(role: string): YourProviderRole {
    switch (role) {
        case "user":
            return "user"
        case "assistant":
            return "assistant"
        case "system":
            return "system"
        default:
            throw new Error(`Unsupported role: ${role}`)
    }
}

private formatContent(content: string | ApiMessageContent[]): string {
    // Implement content formatting
}
```

## Step 5: Add Error Handling

1. Implement error handling:

```typescript
private handleError(error: unknown): Error {
    if (error instanceof YourProviderError) {
        switch (error.code) {
            case "rate_limit_exceeded":
                return new Error("Rate limit exceeded. Please try again later.")
            case "invalid_api_key":
                return new Error("Invalid API key. Please check your credentials.")
            // Handle other error cases
            default:
                return new Error(`Provider error: ${error.message}`)
        }
    }
    return error as Error
}
```

## Step 6: Implement API Key Validation

1. Add validation logic:

```typescript
async validateApiKey(apiKey: string): Promise<boolean> {
    try {
        const client = new YourProviderClient({ apiKey })
        // Make a minimal API call to validate the key
        await client.validateCredentials()
        return true
    } catch (error) {
        return false
    }
}
```

## Step 7: Add Provider Configuration

1. Update provider configuration in `src/shared/api.ts`:

```typescript
export const yourProviderModelInfo: ModelInfo = {
    id: "your-provider-model",
    name: "Your Provider Model",
    description: "Description of your provider's capabilities",
    contextWindow: 16000,
    pricing: {
        input: 0.0001,
        output: 0.0002
    },
    features: {
        functions: true,
        images: false
    }
}
```

## Step 8: Register the Provider

1. Add provider registration in `src/api/index.ts`:

```typescript
import { YourProviderHandler } from "./providers/your-provider"

export function createApiHandler(options: ApiHandlerOptions): ApiHandler {
    switch (options.provider) {
        case "your-provider":
            return new YourProviderHandler(options)
        // ... other providers
    }
}
```

## Step 9: Add Provider Tests

1. Create test file:

```typescript
// src/api/providers/__tests__/your-provider.test.ts
import { YourProviderHandler } from "../your-provider"

describe("YourProviderHandler", () => {
    let handler: YourProviderHandler

    beforeEach(() => {
        handler = new YourProviderHandler({
            apiKey: "test-key",
            provider: "your-provider"
        })
    })

    test("generates stream correctly", async () => {
        // Test stream generation
    })

    test("validates API key", async () => {
        // Test API key validation
    })

    test("handles errors appropriately", async () => {
        // Test error handling
    })
})
```

## Step 10: Update UI Components

1. Add provider selection in settings:

```typescript
// webview-ui/src/components/Settings/ProviderConfig.tsx
export const ProviderConfig: React.FC = () => {
    return (
        <Select
            value={selectedProvider}
            onChange={handleProviderChange}
        >
            <Option value="your-provider">
                Your Provider
            </Option>
            {/* Other providers */}
        </Select>
    )
}
```

## Step 11: Add Documentation

1. Update provider documentation:
   - Add provider capabilities
   - Document configuration options
   - Provide usage examples
   - List supported features

2. Update changelog:
   - Document the new provider addition
   - List any breaking changes
   - Provide migration instructions if needed

## Testing Checklist

Before submitting your provider:

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Stream handling works correctly
- [ ] Error handling is robust
- [ ] API key validation works
- [ ] Documentation is complete
- [ ] UI changes are tested
- [ ] Performance is acceptable

## Best Practices

1. **Error Handling**
   - Provide clear error messages
   - Handle rate limits gracefully
   - Implement proper fallbacks

2. **Performance**
   - Optimize stream processing
   - Minimize memory usage
   - Handle large responses efficiently

3. **Security**
   - Secure API key handling
   - Validate all inputs
   - Sanitize responses

4. **Maintenance**
   - Keep dependencies updated
   - Monitor API changes
   - Update documentation

## Troubleshooting

Common issues and solutions:

1. **Stream Connection Issues**
   - Check network connectivity
   - Verify API credentials
   - Review rate limits

2. **Message Format Errors**
   - Validate message structure
   - Check content formatting
   - Verify role mapping

3. **Performance Problems**
   - Profile stream processing
   - Check memory usage
   - Optimize request handling

## Support

If you need help:
1. Check the [Discord community](https://discord.gg/cline)
2. Review [GitHub issues](https://github.com/cline/cline/issues)
3. Contact the maintainers

## Contributing

After implementing your provider:
1. Submit a pull request
2. Add tests and documentation
3. Respond to review comments
4. Update based on feedback

Remember to follow Cline's coding standards and contribution guidelines. 