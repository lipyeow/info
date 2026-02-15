import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { appSpec } from '../app-spec.js';
import type { A2UIComponent } from '../a2ui/types.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@customElement('a2ui-chat')
export class A2UIChat extends LitElement {
  @property() model = 'gpt-4o-mini';
  @property() storageKeyPrefix = 'a2ui-chat';

  @state() private _connected = false;
  @state() private _endpoint = '';
  @state() private _apiKey = '';
  @state() private _modelName = '';
  @state() private _messages: ChatMessage[] = [];
  @state() private _input = '';
  @state() private _streaming = false;
  @state() private _error = '';

  private _abortController: AbortController | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadFromStorage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._abortController?.abort();
  }

  private _storageKey(suffix: string): string {
    return `${this.storageKeyPrefix}-${suffix}`;
  }

  private _loadFromStorage() {
    try {
      const endpoint = sessionStorage.getItem(this._storageKey('endpoint'));
      const apiKey = sessionStorage.getItem(this._storageKey('apiKey'));
      const modelName = sessionStorage.getItem(this._storageKey('model'));
      const messages = sessionStorage.getItem(this._storageKey('messages'));
      if (endpoint && apiKey) {
        this._endpoint = endpoint;
        this._apiKey = apiKey;
        this._modelName = modelName || this.model;
        this._connected = true;
      }
      if (messages) {
        this._messages = JSON.parse(messages);
      }
    } catch {
      // ignore storage errors
    }
  }

  private _saveConfig() {
    sessionStorage.setItem(this._storageKey('endpoint'), this._endpoint);
    sessionStorage.setItem(this._storageKey('apiKey'), this._apiKey);
    sessionStorage.setItem(this._storageKey('model'), this._modelName);
  }

  private _saveMessages() {
    sessionStorage.setItem(
      this._storageKey('messages'),
      JSON.stringify(this._messages)
    );
  }

  private _handleConnect() {
    const endpointInput = this.querySelector<HTMLInputElement>('#chat-endpoint');
    const apiKeyInput = this.querySelector<HTMLInputElement>('#chat-apikey');
    const modelInput = this.querySelector<HTMLInputElement>('#chat-model');
    const endpoint = endpointInput?.value.trim() ?? '';
    const apiKey = apiKeyInput?.value.trim() ?? '';
    const modelName = modelInput?.value.trim() || this.model;

    if (!endpoint || !apiKey) {
      this._error = 'Please provide both endpoint URL and API key.';
      return;
    }

    this._endpoint = endpoint.replace(/\/+$/, '');
    this._apiKey = apiKey;
    this._modelName = modelName;
    this._error = '';
    this._connected = true;
    this._saveConfig();
  }

  private _handleDisconnect() {
    this._abortController?.abort();
    this._connected = false;
    this._endpoint = '';
    this._apiKey = '';
    this._modelName = '';
    this._messages = [];
    this._streaming = false;
    this._error = '';
    sessionStorage.removeItem(this._storageKey('endpoint'));
    sessionStorage.removeItem(this._storageKey('apiKey'));
    sessionStorage.removeItem(this._storageKey('model'));
    sessionStorage.removeItem(this._storageKey('messages'));
  }

  private _handleClear() {
    this._abortController?.abort();
    this._messages = [];
    this._streaming = false;
    this._error = '';
    this._saveMessages();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._handleSend();
    }
  }

  private async _handleSend() {
    const text = this._input.trim();
    if (!text || this._streaming) return;

    this._error = '';
    this._input = '';
    this._messages = [...this._messages, { role: 'user', content: text }];
    this._saveMessages();

    // Force textarea to clear
    const textarea = this.querySelector<HTMLTextAreaElement>('.chat-textarea');
    if (textarea) textarea.value = '';

    await this._streamResponse();
  }

  private _handleStop() {
    this._abortController?.abort();
    this._streaming = false;
  }

  private _extractSiteContent(): { text: string; dataUrls: string[] } {
    const parts: string[] = [];
    parts.push(
      'You are a helpful assistant that answers questions about the person described below. Be concise: give short, direct answers that specifically address the question asked. Avoid filler, unnecessary context, or restating the question. Use bullet points for lists. If the answer is not in the provided content, say so briefly.\n'
    );

    const dataUrls: string[] = [];

    for (const comp of appSpec.updateComponents.components) {
      const c = comp as A2UIComponent & Record<string, unknown>;
      switch (c.component) {
        case 'Heading':
          parts.push(`## ${(c as { text: string }).text}`);
          break;
        case 'Markdown':
          parts.push((c as { content: string }).content);
          break;
        case 'RichContent': {
          const div = document.createElement('div');
          div.innerHTML = (c as { htmlContent: string }).htmlContent;
          const text = div.textContent ?? '';
          if (text.trim()) parts.push(text.trim());
          break;
        }
        case 'DataTable':
          dataUrls.push((c as { dataUrl: string }).dataUrl);
          break;
      }
    }

    return { text: parts.join('\n\n'), dataUrls };
  }

  private async _buildSystemPrompt(): Promise<string> {
    const { text, dataUrls } = this._extractSiteContent();
    const parts = [text];

    if (dataUrls.length > 0) {
      const results = await Promise.allSettled(
        dataUrls.map(async (url) => {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`Failed to fetch ${url}`);
          const data = await resp.json();
          return { url, data };
        })
      );
      for (const result of results) {
        if (result.status === 'fulfilled') {
          parts.push(
            `\n## Data from ${result.value.url}\n\`\`\`json\n${JSON.stringify(result.value.data, null, 2)}\n\`\`\``
          );
        }
      }
    }

    return parts.join('\n\n');
  }

  private async _streamResponse() {
    this._streaming = true;
    this._abortController = new AbortController();

    // Add empty assistant message to fill in
    this._messages = [...this._messages, { role: 'assistant', content: '' }];

    try {
      const systemPrompt = await this._buildSystemPrompt();

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...this._messages
          .filter((m) => m.content || m.role === 'assistant')
          .slice(0, -1) // exclude the empty assistant message
          .map((m) => ({ role: m.role, content: m.content })),
      ];

      const resp = await fetch(this._endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._apiKey}`,
        },
        body: JSON.stringify({
          model: this._modelName || this.model,
          messages: apiMessages,
          stream: true,
        }),
        signal: this._abortController.signal,
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => resp.statusText);
        throw new Error(`API error ${resp.status}: ${errText}`);
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              const msgs = [...this._messages];
              const last = msgs[msgs.length - 1];
              msgs[msgs.length - 1] = {
                ...last,
                content: last.content + delta,
              };
              this._messages = msgs;
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled — that's fine
      } else {
        this._error =
          err instanceof Error ? err.message : 'An unknown error occurred';
      }
    } finally {
      this._streaming = false;
      this._abortController = null;
      // Remove empty assistant message if nothing was streamed
      if (
        this._messages.length > 0 &&
        this._messages[this._messages.length - 1].role === 'assistant' &&
        !this._messages[this._messages.length - 1].content
      ) {
        this._messages = this._messages.slice(0, -1);
      }
      this._saveMessages();
    }
  }

  updated() {
    // Auto-scroll message list during streaming
    const list = this.querySelector('.chat-messages');
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  private _renderConfig() {
    return html`
      <div class="chat-config">
        <h3 class="chat-config-title">Connect to an LLM</h3>
        <p class="chat-config-desc">
          Provide your own API key for an OpenAI-compatible endpoint.
          Your key is stored only in sessionStorage and cleared when the browser tab closes.
        </p>

        ${this._error
          ? html`<div class="chat-error">${this._error}</div>`
          : nothing}

        <label class="chat-label">Protocol</label>
        <select class="chat-config-input" disabled>
          <option>OpenAI API</option>
        </select>

        <label class="chat-label">Endpoint URL</label>
        <input
          id="chat-endpoint"
          class="chat-config-input"
          type="text"
          placeholder="https://api.openai.com/v1/chat/completions"
          .value=${this._endpoint}
        />

        <label class="chat-label">Model</label>
        <input
          id="chat-model"
          class="chat-config-input"
          type="text"
          placeholder="${this.model}"
          .value=${this._modelName}
        />

        <label class="chat-label">API Key</label>
        <input
          id="chat-apikey"
          class="chat-config-input"
          type="password"
          placeholder="sk-..."
          .value=${this._apiKey}
        />

        <button class="chat-connect-btn" @click=${this._handleConnect}>
          Connect
        </button>
      </div>
    `;
  }

  private _renderChat() {
    return html`
      <div class="chat-interface">
        <div class="chat-header">
          <span class="chat-header-status">
            Connected to <strong>${this._endpoint}</strong>
          </span>
          <div class="chat-header-actions">
            <button class="chat-action-btn" @click=${this._handleClear}>
              Clear
            </button>
            <button class="chat-action-btn" @click=${this._handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>

        ${this._error
          ? html`<div class="chat-error">${this._error}</div>`
          : nothing}

        <div class="chat-messages">
          ${this._messages.length === 0
            ? html`<div class="chat-empty">Ask me anything about Lipyeow</div>`
            : this._messages.map(
                (msg) => html`
                  <div class="chat-message chat-message-${msg.role}">
                    <div class="chat-message-label">
                      ${msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div class="chat-message-content">
                      ${msg.role === 'assistant'
                        ? html`<div class="chat-markdown">
                            ${unsafeHTML(
                              marked.parse(msg.content || '...') as string
                            )}
                          </div>`
                        : msg.content}
                    </div>
                  </div>
                `
              )}
        </div>

        <div class="chat-input-row">
          <textarea
            class="chat-textarea"
            placeholder="Type a message..."
            rows="2"
            @input=${(e: Event) =>
              (this._input = (e.target as HTMLTextAreaElement).value)}
            @keydown=${this._handleKeydown}
            .value=${this._input}
            ?disabled=${this._streaming}
          ></textarea>
          ${this._streaming
            ? html`<button
                class="chat-send-btn chat-stop-btn"
                @click=${this._handleStop}
              >
                Stop
              </button>`
            : html`<button class="chat-send-btn" @click=${this._handleSend}>
                Send
              </button>`}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="chat-container">
        ${this._connected ? this._renderChat() : this._renderConfig()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a2ui-chat': A2UIChat;
  }
}
