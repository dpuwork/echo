export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Sleep-For",
      "Access-Control-Expose-Headers": "X-LLM-Duration-Ms",
      "Access-Control-Max-Age": "86400",
    };

    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method === "GET") {
      return new Response(getHTMLContent(), {
        headers: { 
          "Content-Type": "text/html;charset=UTF-8",
          ...corsHeaders
        },
      });
    }

    if (request.method === "POST") {
      if (url.pathname === "/v1/chat/completions") {
        try {
          const payload = await request.json();
          
          const startTime = Date.now();
          const llmResponse = await fetch("https://opencode.ai/zen/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const endTime = Date.now();
          const duration = endTime - startTime;

          if (!llmResponse.ok) {
            const errText = await llmResponse.text();
            return new Response(JSON.stringify({ error: `LLM Endpoint Error: ${llmResponse.status}`, details: errText }), {
              status: llmResponse.status,
              headers: {
                "Content-Type": "application/json",
                "X-LLM-Duration-Ms": duration.toString(),
                ...corsHeaders
              }
            });
          }

          const data = await llmResponse.json();
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-LLM-Duration-Ms": duration.toString(),
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: `Internal Proxy Error: ${error.message}` }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      } else {
        const sleep = parseInt(request.headers.get("X-Sleep-For") || "0", 10);
        if (sleep > 0) {
          await new Promise(r => setTimeout(r, sleep));
        }
        return new Response(JSON.stringify({ ok: true, processedAt: Date.now() }), {
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        });
      }
    }

    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  },
};

function getHTMLContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dpuwork.com // http-latency-tester</title>
    <style>
        :root {
            --bg: #ffffff;
            --text: #000000;
            --card-bg: #f5f5f5;
            --border: #e0e0e0;
            --subtext: #666666;
            --btn-bg: #000000;
            --btn-text: #ffffff;
            --btn-hover: #333333;
            --accent: #51ff00;
            --arrow-svg: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #000000;
                --text: #ffffff;
                --card-bg: #111111;
                --border: #222222;
                --subtext: #888888;
                --btn-bg: #ffffff;
                --btn-text: #000000;
                --btn-hover: #cccccc;
                --accent: #51ff00;
                --arrow-svg: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
            }
        }
        body { 
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            background: var(--bg); 
            color: var(--text); 
            line-height: 1.5;
        }
        .header {
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 16px;
        }
        .header h1 {
            font-size: 1.5rem;
            margin: 0 0 8px 0;
            letter-spacing: -0.05em;
        }
        .header-links {
            font-size: 0.85rem;
            color: var(--subtext);
        }
        .tabs {
            display: flex;
            border-bottom: 1px solid var(--border);
            margin-bottom: 24px;
            gap: 16px;
        }
        .tab {
            padding: 8px 4px;
            cursor: pointer;
            font-size: 0.9rem;
            text-transform: uppercase;
            color: var(--subtext);
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
            font-weight: bold;
            transition: all 0.15s ease;
        }
        .tab.active {
            color: var(--text);
            border-bottom: 2px solid var(--accent);
        }
        .tab:hover {
            color: var(--text);
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .container {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .section-title {
            font-size: 0.9rem;
            font-weight: bold;
            text-transform: uppercase;
            color: var(--subtext);
            margin-bottom: 16px;
        }
        .form-row {
            margin-bottom: 16px;
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        label {
            display: block;
            font-size: 0.8rem;
            color: var(--subtext);
            margin-bottom: 6px;
            text-transform: uppercase;
        }
        input, select, textarea {
            width: 100%;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 10px;
            border-radius: 4px;
            font-family: inherit;
            box-sizing: border-box;
        }
        select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: var(--arrow-svg);
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 18px;
            padding-right: 36px;
        }
        textarea {
            resize: vertical;
        }
        button {
            width: 100%;
            background: var(--btn-bg);
            color: var(--btn-text);
            border: none;
            padding: 12px;
            border-radius: 4px;
            font-family: inherit;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.1s ease;
        }
        button:hover { background: var(--btn-hover); }
        button:disabled {
            background: var(--border);
            color: var(--subtext);
            cursor: not-allowed;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
        }
        .stat-card {
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 4px;
        }
        .stat-label {
            font-size: 0.75rem;
            color: var(--subtext);
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent);
        }
        .stat-value.meta { color: var(--text); }
        .log-box {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 14px;
            font-size: 0.85rem;
            max-height: 220px;
            overflow-y: auto;
            color: var(--subtext);
            white-space: pre-wrap;
        }
        .output-box {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 14px;
            font-size: 0.85rem;
            color: var(--text);
            white-space: pre-wrap;
            overflow-x: auto;
            max-height: 400px;
        }
        .log-line {
            padding: 4px 0;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
        }
        .log-line:last-child { border-bottom: none; }
        .log-idx { color: var(--subtext); opacity: 0.6; }
        .log-rtt { color: var(--subtext); }
        .log-transit { color: var(--accent); font-weight: bold; }
    </style>
</head>
<body>

<div class="header">
    <h1>dpuwork.com // http-latency-tester</h1>
</div>

<div class="tabs">
    <div class="tab active" id="tab-network" onclick="switchTab('network')">HTTP Benchmark</div>
    <div class="tab" id="tab-llm" onclick="switchTab('llm')">LLM Gateway</div>
</div>

<!-- Tab: HTTP Benchmark -->
<div id="content-network" class="tab-content active">
    <div class="container">
        <div class="section-title">Configuration</div>
        
        <div class="form-grid">
            <div class="form-row">
                <label for="testCount">Test Cycles</label>
                <select id="testCount">
                    <option value="5">5 Cycles</option>
                    <option value="10" selected>10 Cycles</option>
                    <option value="20">20 Cycles</option>
                </select>
            </div>
            <div class="form-row">
                <label for="sleepInput">Simulate server delay (ms)</label>
                <input type="number" id="sleepInput" value="0" min="0">
            </div>
        </div>

        <div class="form-row" style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="useRelayCheck" style="width: auto; margin: 0;">
            <label for="useRelayCheck" style="margin-bottom: 0; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;">Use Relay Proxy</label>
        </div>

        <div id="proxyUrlContainer" class="form-row" style="display: none; margin-top: 16px;">
            <label for="proxyUrl">Relay Proxy URL</label>
            <input type="text" id="proxyUrl" value="https://relay.dpuwork.com/" placeholder="e.g. https://relay.dpuwork.com/">
        </div>

        <button id="runTestBtn" style="margin-top: 16px;">Run Benchmark</button>
    </div>

    <div class="container">
        <div class="section-title">Delay results</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Average Transit</div>
                <div class="stat-value" id="avgTransit">-- ms</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Median Transit</div>
                <div class="stat-value" id="medianTransit">-- ms</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average RTT</div>
                <div class="stat-value meta" id="avgRtt">-- ms</div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="section-title">Execution Logs [Status: <span id="progress" style="color: var(--text);">0/0</span>]</div>
        <div class="log-box" id="output">Ready to run benchmark.</div>
    </div>
</div>

<!-- Tab: LLM Gateway -->
<div id="content-llm" class="tab-content">
    <div class="container">
        <div class="section-title">LLM Configuration</div>
        
        <div class="form-grid">
            <div class="form-row">
                <label for="llmModel">Model</label>
                <select id="llmModel">
                    <option value="nemotron-3-ultra-free" selected>Nemotron 3 Ultra (Free)</option>
                    <option value="deepseek-v4-flash-free">DeepSeek V4 Flash (Free)</option>
                    <option value="mimo-v2.5-free">Mimo v2.5 (Free)</option>
                    <option value="north-mini-code-free">North Mini Code (Free)</option>
                    <option value="big-pickle">Big Pickle</option>
                </select>
            </div>
            <div class="form-row">
                <label for="llmRoute">Connection Mode</label>
                <select id="llmRoute">
                    <option value="local" selected>Direct (Local)</option>
                    <option value="proxy">Relay Proxy</option>
                </select>
            </div>
        </div>

        <div id="llmProxyContainer" class="form-row" style="display: none;">
            <label for="llmProxyUrl">LLM Proxy URL</label>
            <input type="text" id="llmProxyUrl" value="https://relay.dpuwork.com" placeholder="e.g. https://relay.dpuwork.com">
        </div>

        <div class="form-row">
            <label for="llmPrompt">Prompt</label>
            <textarea id="llmPrompt" rows="3">Explain quantum computing in one sentence.</textarea>
        </div>

        <button id="runLlmBtn">Run LLM Query</button>
    </div>

    <div class="container">
        <div class="section-title">LLM delay results</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total RTT</div>
                <div class="stat-value" id="llmDuration">-- ms</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">LLM Engine Processing</div>
                <div class="stat-value" id="llmProcessTime">-- ms</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Relay Overhead</div>
                <div class="stat-value meta" id="llmOverhead">-- ms</div>
            </div>
        </div>
    </div>

    <div class="container" id="llmReasoningContainer" style="display: none;">
        <div class="section-title">Thought Process (Reasoning)</div>
        <div class="output-box" id="llmReasoningBox" style="color: var(--subtext); font-style: italic;"></div>
    </div>

    <div class="container">
        <div class="section-title">Response Content</div>
        <div class="output-box" id="llmResponseBox">Awaiting query...</div>
    </div>

    <div class="container">
        <div class="section-title">Execution Logs</div>
        <div class="log-box" id="llmLogBox">Ready to run LLM query.</div>
    </div>
</div>

<script>
    // Tab switching logic
    function switchTab(tabId) {
        document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        
        document.getElementById(\`tab-\${tabId}\`).classList.add('active');
        document.getElementById(\`content-\${tabId}\`).classList.add('active');
    }

    // Toggle relay proxy visibility under HTTP Benchmark
    const useRelayCheck = document.getElementById('useRelayCheck');
    const proxyUrlContainer = document.getElementById('proxyUrlContainer');
    
    useRelayCheck.addEventListener('change', () => {
        proxyUrlContainer.style.display = useRelayCheck.checked ? 'block' : 'none';
    });

    // Toggle LLM proxy visibility under LLM Gateway
    const llmRouteSelect = document.getElementById('llmRoute');
    const llmProxyContainer = document.getElementById('llmProxyContainer');
    
    llmRouteSelect.addEventListener('change', () => {
        llmProxyContainer.style.display = llmRouteSelect.value === 'proxy' ? 'block' : 'none';
    });

    // Original Network Benchmark Logic
    const getAverage = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
    const getMedian = arr => {
        const s = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(s.length / 2);
        return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
    };

    document.getElementById('runTestBtn').addEventListener('click', async () => {
        const btn = document.getElementById('runTestBtn');
        const out = document.getElementById('output');
        const avgTransitEl = document.getElementById('avgTransit');
        const medianTransitEl = document.getElementById('medianTransit');
        const avgRttEl = document.getElementById('avgRtt');
        const progressEl = document.getElementById('progress');

        btn.disabled = true;
        out.innerHTML = "";
        
        const totalTests = parseInt(document.getElementById('testCount').value, 10);
        const sleepTime = parseInt(document.getElementById('sleepInput').value, 10) || 0;
        
        const useRelay = useRelayCheck.checked;
        const proxyPrefix = useRelay ? document.getElementById('proxyUrl').value.trim() : '';
        let targetUrl = window.location.origin + window.location.pathname;
        if (useRelay && proxyPrefix) {
            targetUrl = proxyPrefix + targetUrl;
        }

        const transitTimes = [];
        const rttTimes = [];

        for (let i = 0; i < totalTests; i++) {
            progressEl.textContent = \`\${i + 1}/\${totalTests}\`;
            
            const logLine = document.createElement('div');
            logLine.className = 'log-line';
            logLine.innerHTML = \`<span class="log-idx">[Cycle \${i + 1}/\${totalTests}]</span> <span>Pinging...</span>\`;
            out.appendChild(logLine);
            out.scrollTop = out.scrollHeight;

            const startTime = Date.now();
            try {
                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: {
                        'X-Sleep-For': sleepTime.toString()
                    }
                });
                
                await response.json(); 
                
                const endTime = Date.now();
                const rtt = endTime - startTime;
                const transit = Math.max(0, rtt - sleepTime);

                rttTimes.push(rtt);
                transitTimes.push(transit);

                logLine.innerHTML = \`<span class="log-idx">[Cycle \${i + 1}/\${totalTests}]</span> <span class="log-rtt">RTT: \${rtt}ms</span> <span class="log-transit">Transit: \${transit}ms</span>\`;
            } catch (err) {
                logLine.innerHTML = \`<span class="log-idx">[Cycle \${i + 1}/\${totalTests}]</span> <span style="color: #ff0000;">Error: \${err.message}</span>\`;
            }

            await new Promise(r => setTimeout(r, 100));
        }

        if (transitTimes.length > 0) {
            avgTransitEl.textContent = \`\${getAverage(transitTimes).toFixed(1)} ms\`;
            medianTransitEl.textContent = \`\${getMedian(transitTimes).toFixed(1)} ms\`;
            avgRttEl.textContent = \`\${getAverage(rttTimes).toFixed(1)} ms\`;
        } else {
            out.textContent = "Execution failure: All cycles failed.";
        }

        btn.disabled = false;
    });

    // LLM Gateway Benchmark Logic
    document.getElementById('runLlmBtn').addEventListener('click', async () => {
        const btn = document.getElementById('runLlmBtn');
        const modelSelect = document.getElementById('llmModel');
        const routeSelect = document.getElementById('llmRoute');
        const promptArea = document.getElementById('llmPrompt');
        
        const durationEl = document.getElementById('llmDuration');
        const processTimeEl = document.getElementById('llmProcessTime');
        const overheadEl = document.getElementById('llmOverhead');
        
        const reasoningBox = document.getElementById('llmReasoningBox');
        const reasoningContainer = document.getElementById('llmReasoningContainer');
        const responseBox = document.getElementById('llmResponseBox');
        const logBox = document.getElementById('llmLogBox');

        btn.disabled = true;
        logBox.innerHTML = "Initiating LLM query...";
        reasoningContainer.style.display = 'none';
        reasoningBox.textContent = '';
        responseBox.textContent = 'Streaming response...';
        
        durationEl.textContent = '-- ms';
        processTimeEl.textContent = '-- ms';
        overheadEl.textContent = '-- ms';

        const model = modelSelect.value;
        const route = routeSelect.value;
        const prompt = promptArea.value.trim();

        const payload = {
            model: model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        };

        let targetUrl = window.location.origin + "/v1/chat/completions";
        if (route === 'proxy') {
            let prefix = document.getElementById('llmProxyUrl').value.trim();
            if (prefix) {
                if (prefix.endsWith('/')) {
                    prefix = prefix.slice(0, -1);
                }
                targetUrl = prefix + "/v1/chat/completions";
            }
        }

        const startTime = Date.now();
        try {
            logBox.innerHTML += \`\\nConnecting to \${targetUrl} via \${route.toUpperCase()}...\`;
            
            const response = await fetch(targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const endTime = Date.now();
            const totalRtt = endTime - startTime;

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(\`HTTP \${response.status}: \${errText}\`);
            }

            const data = await response.json();
            logBox.innerHTML += "\\nResponse received. Processing telemetry...";

            if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
                throw new Error(\`Unexpected API Response Format: \${JSON.stringify(data)}\`);
            }

            const content = data.choices[0].message.content;
            const reasoning = data.choices[0].message.reasoning;

            // Update boxes
            responseBox.textContent = content || "(Empty response content)";
            if (reasoning) {
                reasoningContainer.style.display = 'block';
                reasoningBox.textContent = reasoning;
            }

            // Extract telemetry
            let serverDuration = null;
            const durationHeader = response.headers.get('X-LLM-Duration-Ms');
            if (durationHeader) {
                serverDuration = parseInt(durationHeader, 10);
            }

            durationEl.textContent = \`\${totalRtt} ms\`;
            if (serverDuration !== null) {
                processTimeEl.textContent = \`\${serverDuration} ms\`;
                const overhead = Math.max(0, totalRtt - serverDuration);
                overheadEl.textContent = \`\${overhead} ms\`;
                logBox.innerHTML += \`\\nTelemetry: Total RTT = \${totalRtt}ms, LLM Engine = \${serverDuration}ms, Relay Overhead = \${overhead}ms\`;
            } else {
                processTimeEl.textContent = 'N/A';
                overheadEl.textContent = 'N/A';
                logBox.innerHTML += \`\\nTelemetry: Total RTT = \${totalRtt}ms (X-LLM-Duration-Ms header not present)\`;
            }

        } catch (error) {
            logBox.innerHTML += \`\\nError: \${error.message}\`;
            responseBox.textContent = \`Error details:\\n\${error.message}\`;
        } finally {
            btn.disabled = false;
        }
    });
</script>

</body>
</html>`;
}
