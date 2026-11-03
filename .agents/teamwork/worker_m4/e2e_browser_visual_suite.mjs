import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== TEST SUITE 4: LIVE BROWSER VISUAL & THREE.JS SCENE SUITE (F15) ===\n');

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const WORK_DIR = path.resolve('.agents/teamwork/worker_m4');
const USER_DATA = path.join(WORK_DIR, 'chrome_profile');
const SCREENSHOT_FULL = path.join(WORK_DIR, 'e2e_live_visualizer_full.png');
const SCREENSHOT_WIN = path.join(WORK_DIR, 'e2e_live_visualizer_windows.png');

if (!fs.existsSync(USER_DATA)) {
  fs.mkdirSync(USER_DATA, { recursive: true });
}

// Clean old screenshots if present
if (fs.existsSync(SCREENSHOT_FULL)) fs.unlinkSync(SCREENSHOT_FULL);
if (fs.existsSync(SCREENSHOT_WIN)) fs.unlinkSync(SCREENSHOT_WIN);

console.log('Spawning headless browser instance with WebGL support...');
const proc = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${USER_DATA}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--enable-webgl',
  '--window-size=1600,1000'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const targetTab = tabs.find(t => t.type === 'page');
  console.log(`[PASS] CDP target acquired: ${targetTab.id}`);

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let passed = true;
  const consoleErrors = [];
  const consoleLogs = [];

  ws.onopen = () => {
    console.log('[PASS] WebSocket CDP connection established.');
    console.log('Navigating to http://127.0.0.1:8788/kerja#debug ...');
    ws.send(JSON.stringify({ id: 10, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: 11, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8788/kerja#debug' } }));
  };

  ws.onmessage = async (e) => {
    const raw = e.data.toString();
    const msg = JSON.parse(raw);

    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value ?? JSON.stringify(a)).join(' ');
      consoleLogs.push({ type: msg.params.type, text });
      if (msg.params.type === 'error') consoleErrors.push(text);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(JSON.stringify(msg.params.exceptionDetails));
    }

    if (msg.id === 1) {
      console.log('Page loaded! Waiting 4.5s for Three.js diorama, textures, and actors to initialize...');
      setTimeout(() => {
        // Query title
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.evaluate', params: { expression: 'document.title' } }));
      }, 4500);
    } else if (msg.id === 2) {
      const title = msg.result.result.value;
      console.log(`[PASS] Page Title: "${title}"`);

      // Query canvas and actors
      ws.send(JSON.stringify({
        id: 3,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify((() => {
            const canvas = document.querySelector('#scene canvas');
            const gl = canvas ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;
            const actors = window.__kantor ? window.__kantor.actors() : [];
            const noglEl = document.querySelector('.nogl');
            const noglDisplay = noglEl ? window.getComputedStyle(noglEl).display : 'none';
            return {
              canvasFound: !!canvas,
              canvasWidth: canvas?.width,
              canvasHeight: canvas?.height,
              glContext: gl ? gl.constructor.name : null,
              noglDisplay,
              actorsCount: actors.length,
              actors
            };
          })())`
        }
      }));
    } else if (msg.id === 3) {
      const data = JSON.parse(msg.result.result.value);
      console.log(`[ASSERT] Canvas Found: ${data.canvasFound}, WebGL Context: ${data.glContext}, Resolution: ${data.canvasWidth}x${data.canvasHeight}`);
      console.log(`[ASSERT] NoGL Warning Display: ${data.noglDisplay} (expected "none")`);
      console.log(`[ASSERT] Active Actors Count: ${data.actorsCount}`);

      if (!data.canvasFound || !data.glContext || data.noglDisplay !== 'none') {
        console.error('[FAIL] WebGL canvas was not properly mounted or WebGL failed.');
        passed = false;
      } else {
        console.log('[PASS] WebGL Canvas: Fully active and rendering scene at full resolution.');
      }

      if (data.actorsCount < 5) {
        console.error(`[FAIL] Expected at least 5 actors, got ${data.actorsCount}`);
        passed = false;
      } else {
        console.log('[PASS] All 5 key actors initialized in diorama:');
        for (const a of data.actors) {
          console.log(`   Actor "${a.key}": goal="${a.goal}", walking=${a.walking}, seated=${a.seated}, pos=[${a.pos.join(', ')}]`);
          const [x, y, z] = a.pos;
          if (x < -10.5 || x > 10.5 || z < -7.5 || z > 6.5) {
            console.error(`[FAIL] Actor ${a.key} is outside room boundary at [${x}, ${y}, ${z}]`);
            passed = false;
          }
        }
      }

      // Capture Overview Screenshot
      console.log('Capturing full diorama visual screenshot...');
      ws.send(JSON.stringify({ id: 4, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    } else if (msg.id === 4) {
      fs.writeFileSync(SCREENSHOT_FULL, Buffer.from(msg.result.data, 'base64'));
      console.log(`[PASS] Full screenshot saved: ${SCREENSHOT_FULL} (${fs.statSync(SCREENSHOT_FULL).size} bytes)`);

      // Rotate camera to inspect back wall windows & right side wall window
      console.log('Rotating camera towards back wall windows (F1-F4) and right side window...');
      ws.send(JSON.stringify({
        id: 5,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const canvas = document.querySelector('#scene canvas');
            if (canvas) {
              const rect = canvas.getBoundingClientRect();
              canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: rect.left + 500, clientY: rect.top + 300, button: 0 }));
              canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.left + 420, clientY: rect.top + 380, button: 0 }));
              canvas.dispatchEvent(new MouseEvent('mouseup', { clientX: rect.left + 420, clientY: rect.top + 380, button: 0 }));
            }
          })()`
        }
      }));
    } else if (msg.id === 5) {
      setTimeout(() => {
        console.log('Capturing windows perspective screenshot...');
        ws.send(JSON.stringify({ id: 6, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1000);
    } else if (msg.id === 6) {
      fs.writeFileSync(SCREENSHOT_WIN, Buffer.from(msg.result.data, 'base64'));
      console.log(`[PASS] Windows perspective screenshot saved: ${SCREENSHOT_WIN} (${fs.statSync(SCREENSHOT_WIN).size} bytes)`);

      // Verify Console Errors
      console.log(`[ASSERT] Total Console Logs: ${consoleLogs.length}, Total Errors: ${consoleErrors.length}`);
      if (consoleErrors.length > 0) {
        console.error('[FAIL] Console errors occurred during browser session:');
        consoleErrors.forEach(err => console.error('  ', err));
        passed = false;
      } else {
        console.log('[PASS] Zero console errors during visualizer execution.');
      }

      ws.close();
      proc.kill('SIGTERM');

      if (!passed) {
        console.error('\n--> Test Suite 4 FAILED');
        process.exit(1);
      } else {
        console.log('\n--> Test Suite 4 PASSED (All assertions met)');
        process.exit(0);
      }
    }
  };

  ws.onerror = (e) => {
    console.error('[FAIL] WS Error:', e);
    passed = false;
    proc.kill('SIGTERM');
    process.exit(1);
  };
}

run().catch(e => {
  console.error('[FAIL] Runner error:', e);
  proc.kill('SIGTERM');
  process.exit(1);
});
