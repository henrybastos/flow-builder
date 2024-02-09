import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {
   "videos": {
      "template_schema": {
         "video_url": ""
      },
      "schema": {
         "label": "Videos",
         "tooltip": "All videos to scrape the duration from.",
         "fields_type": "array",
         "fields": {
            "video_url": {
               "schema": {
                  "label": "Video URL",
                  "placeholder": "https://www.youtube.com/watch?v=_OF8Y6PmaoQ",
                  "type": "text"
               }
            }
         }
      },
      "value": []
   }
};

const PAYLOAD: Payload = {
   "env": {
      "videos": [
         {
            "video_url": "https://www.youtube.com/watch?v=_OF8Y6PmaoQ"
         },
         {
            "video_url": "https://www.youtube.com/watch?v=Jb60Xai_SOo"
         }
      ]
   },
   "flows": {
      "main_flow": [
         {
            "command": "run_flow_for_each",
            "enabled": true,
            "flow": "scrape_video_info",
            "env_var": "%videos%"
         }
      ],
      "scrape_video_info": [
         {
            "command": "goto",
            "enabled": true,
            "target": "%video_url%"
         },
         {
            "command": "eval_expression",
            "enabled": true,
            "expression": "(() => {    let [sec, min, hour] = x('//*/span[@class=\"ytp-time-duration\"]').innerText.split(':').reverse();    let title = x('//*/h1[@class=\"style-scope ytd-watch-metadata\"]').innerText;    return { [title]: ((parseInt(hour) || 0) * 3600) + ((parseInt(min) || 0) * 60) + parseInt(sec) }; })()"
         }
      ]
   },
   "config": {
      "ws_endpoint": "",
      "close_browser_on_finish": false,
      "close_browser_on_cancel_request": false,
      "headless": false
   }
};

export const YTEvalDurationScraperConverterBlock = {
    title: 'YT Eval Duration Scraper Converter Block',
    block_id: 'c222151f-fc54-49d6-9c67-e2f7532a0d3e',
    description: 'Scrapes and Converts all YT video durations.',
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}