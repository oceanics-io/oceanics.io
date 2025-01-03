import { entity } from "@oceanics/functions";
import type { Handler } from "@netlify/functions";
import { Node } from "@logtail/js"

const url = process.env.NEO4J_HOSTNAME ?? "";
const access_key = process.env.NEO4J_ACCESS_KEY ?? "";
const logging_token = process.env.LOGTAIL_SOURCE_TOKEN ?? "";
let log: Node | null = null;
export const handler: Handler = async function (event, context) {
    const start = performance.now();
    if (!log) log = new Node(logging_token);
    const result = await entity(
        url,
        access_key,
        event,
        context
    );
    const duration = performance.now() - start;
    log.info(`${event.httpMethod} entity`, {
        event,
        context,
        duration
    })
    return result
}
