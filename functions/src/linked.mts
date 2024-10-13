import { paths } from "../../specification.json";
import { linked } from "@oceanics/functions";
import type { Handler } from "@netlify/functions";
import { Node as Logtail} from "@logtail/js";

const url = process.env.NEO4J_HOSTNAME ?? "";
const access_key = process.env.NEO4J_ACCESS_KEY ?? "";
const specification = paths["/{root}({rootId})/{entity}"];
const log = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN??"");
const curried = linked.bind(
    undefined,
    url,
    access_key,
    specification
);
export const handler: Handler = async function (event, context) {
    const start = performance.now();
    const result = await curried(event, context);
    const duration = performance.now() - start;
    log.info(`${event.httpMethod} linked`, {
        event, 
        context,
        duration
    })
    return result
}