import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {};

const PAYLOAD: Payload = {
   "config": {
      "ws_endpoint": "",
      "close_browser_on_finish": false,
      "close_browser_on_cancel_request": false,
      "headless": false
   },
   "env": {},
   "flows": {
      "main_flow": [
         {
            "command": "goto",
            "enabled": true,
            "target": "https://www.youtube.com/playlist?list=PLUzFN5xVei7UatVhlxlw3576rgwg2RTXf"
         },
         {
            "command": "eval_expression",
            "enabled": true,
            "expression": "(() => Object.fromEntries(xxx('//*/a[@id=\"video-title\"]').map(video => [video.innerText, video.href])) )()"
         }
      ]
   }
};

export const ScrapePlaylistBlock = {
    title: 'ScrapePlaylist',
    block_id: '8fe3cbdc-7836-4ba3-b95d-b59d574c32d2',
    description: 'A new Flow Block.',
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}