export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Sleep-For",
      "Access-Control-Max-Age": "86400",
    };

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
    <title>dpuwork.com // network-latency-tester</title>
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
            --accent: #007700;
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
                --accent: #00ff00;
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
            margin-bottom: 32px;
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
        input, select {
            width: 100%;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 10px;
            border-radius: 4px;
            font-family: inherit;
            box-sizing: border-box;
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
    <h1>dpuwork.com // network-latency-tester</h1>
    <div class="header-links">
        <span>active metrics</span> · <span>zero dependencies</span>
    </div>
</div>

<div class="container">
    <div class="section-title">configuration</div>
    
    <div class="form-grid">
        <div class="form-row">
            <label for="testCount">sample iterations</label>
            <select id="testCount">
                <option value="5">5 CYCLES</option>
                <option value="10" selected>10 CYCLES</option>
                <option value="20">20 CYCLES</option>
            </select>
        </div>
        <div class="form-row">
            <label for="sleepInput">server delay (ms)</label>
            <input type="number" id="sleepInput" value="0" min="0">
        </div>
    </div>

    <div class="form-row">
        <label for="proxyUrl">relay proxy prefix url (optional)</label>
        <input type="text" id="proxyUrl" placeholder="e.g. https://cors-anywhere.herokuapp.com/">
    </div>

    <button id="runTestBtn">run benchmark</button>
</div>

<div class="container">
    <div class="section-title">telemetry results</div>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">transit avg</div>
            <div class="stat-value" id="avgTransit">-- ms</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">transit median</div>
            <div class="stat-value" id="medianTransit">-- ms</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">rtt avg</div>
            <div class="stat-value meta" id="avgRtt">-- ms</div>
        </div>
    </div>
</div>

<div class="container">
    <div class="section-title">execution logs [status: <span id="progress" style="color: var(--text);">0/0</span>]</div>
    <div class="log-box" id="output">SYSTEM_READY: Awaiting execution orders...</div>
</div>

<script>
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
        
        const proxyPrefix = document.getElementById('proxyUrl').value.trim();
        let targetUrl = window.location.origin + window.location.pathname;
        if (proxyPrefix) {
            targetUrl = proxyPrefix + targetUrl;
        }

        const transitTimes = [];
        const rttTimes = [];

        for (let i = 0; i < totalTests; i++) {
            progressEl.textContent = \`\${i + 1}/\${totalTests}\`;
            
            const logLine = document.createElement('div');
            logLine.className = 'log-line';
            logLine.innerHTML = \`<span class="log-idx">[CYCLE \${i + 1}/\${totalTests}]</span> <span>PINGING...</span>\`;
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

                logLine.innerHTML = \`<span class="log-idx">[CYCLE \${i + 1}/\${totalTests}]</span> <span class="log-rtt">RTT: \${rtt}ms</span> <span class="log-transit">TRANSIT: \${transit}ms</span>\`;
            } catch (err) {
                logLine.innerHTML = \`<span class="log-idx">[CYCLE \${i + 1}/\${totalTests}]</span> <span style="color: #ff0000;">ERROR: \${err.message.toUpperCase()}</span>\`;
            }

            await new Promise(r => setTimeout(r, 100));
        }

        if (transitTimes.length > 0) {
            avgTransitEl.textContent = \`\${getAverage(transitTimes).toFixed(1)} ms\`;
            medianTransitEl.textContent = \`\${getMedian(transitTimes).toFixed(1)} ms\`;
            avgRttEl.textContent = \`\${getAverage(rttTimes).toFixed(1)} ms\`;
        } else {
            out.textContent = "EXECUTION_FAILURE: All iterations dropped.";
        }

        btn.disabled = false;
    });
</script>

</body>
</html>`;
}
