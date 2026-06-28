/**
 * Welcome to Cloudflare Workers! This is a starter worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export type Env = Record<string, unknown>;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		return new Response(`Echo worker is online!\nPath: ${url.pathname}\nMethod: ${request.method}\n`, {
			headers: {
				"content-type": "text/plain;charset=UTF-8",
			},
		});
	},
};
