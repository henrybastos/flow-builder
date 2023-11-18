# Flow Builder

The Flow Builder was created to fulfill automation needs, using [Puppeteer](https://pptr.dev) to do all the work. To help the flow creation, a GUI was created, using [SvelteKit](https://kit.svelte.dev) and [Tailwind CSS](https://tailwindcss.com). The goal of this project is to make automation faster and easier, through a low-code software.

To run, use:

```bash
pnpm dev
# or
npm dev
```

# Payload, Flows and Operations

For the automation to work, the server-side receives a POST request with the following JSON:

## The `payload` object

There's the `env` object and the `flows` object, composing the `payload`.

```json
{
   "env": {},
   "flows": {}
}
```

## The `flows` object

The `flows` object groups all the flows to be executed. A flow is composed by `operations`, wich contains `commands` and `attributes` to perform some action.

```json
"flow_name": {
   "operation_name": {
      "command": "operation_name"
   }
}
```

Throughout the project, the "flow" of the automation is dictated by the `main_flow`. It runs the main stream of flows and it's the only flow execute automatically. Other flows will only run if called by other operations.

```json
"flows": {
   "main_flow": {
      "goto": {
         "command": "goto",
         "url": "https://kit.svelte.dev"
      },
      "run_flow": {
         "command": "run_flow",
         "flow": "flow_002"
      }
   },
   "flow_002": {
      "command_001": {
         "command": "command_name",
         "attributes": {}
      }
   }
}
```

## The `env` object

The `env` object receives all the environment variables. They are used internally — to configure something — or by replacement in the input fields of the operations — by using the environment variable name inside `%%` (e.g. `%env_variable%` refers to the environment variable `env_variable`).

```json
{
   "env": {
      "puppeteer_website": "https://pptr.dev"
   },
   "flows": {
      "main_flow": {
         "goto": {
            "command": "goto",
            "url": "%puppeteer_website%"
         }
      }
}
}
```