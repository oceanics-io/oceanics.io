/**
 * Cloud function version of API
 */
// import {hello_world} from "./pkg/neritics";
import type { Handler } from "@netlify/functions";
import { catchAll, connect, GraphNode, parseNode, Link, Properties, transform, tokenClaim } from "../shared/driver";

interface IEntity {
    entity: string;
    uuid?: string;
}
interface ISensorThings {
    entity: string;
    user: GraphNode;
};
interface ICreate extends ISensorThings{
    properties: Properties;
};
interface IMutate extends ISensorThings{
    uuid?: string;
}


/**
 * Get an array of all collections by Node type
 */
const index = async () => {
    const {query} = GraphNode.allLabels();
    const {records} = await connect(query)
    //@ts-ignore
    const fields = records.flatMap(({_fields: [label]}) => label)
    const result = [...new Set(fields)].map((label: string) => Object({
        name: label,
        url: `/api/${label}`
    }));
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    };
}


/**
 * Create some nodes, usually one, within the graph. This will
 * automatically be attached to User and Provider nodes (internal).
 * 
 * Blank and null values are ignored, and will not overwrite existing
 * properties. This implies that once a property is set once, it cannot
 * be "unset" without special handling. 
 * 
 * Location data receives additional processing logic internally.
 */
 const create = async (left: GraphNode, right: GraphNode) => {
    const cypher = new Link("Create", 0, 0, "").insert(left, right)
    await connect(cypher.query)
    return { statusCode: 204 }
}

/**
 * Retrieve one or more entities of a single type. This may be filtered
 * by any single property. 
 */
const metadata = async (left: GraphNode, right: GraphNode) => {
    const {query} = (new Link()).query(left, right, right.symbol);
    const value = transform((await connect(query)));
    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "@iot.count": value.length,
            value,
        })
    }
}

/**
 * Change or add properties to an existing entity node. This
 * handles PUT/PATCH requests when the node pattern includes
 * a uuid contained within parenthesis
 */
const mutate = ({entity, user}: IMutate) => {
    // const [e, mutation] = parseAsNodes({}, {});
    // const cypher = e.mutate(mutation);
    // return connect(cypher.query);
}

/**
 * Delete a pattern from the graph. Be careful, this can
 * remove all nodes matching the pattern. We usually restrict
 * to a pattern with an indexed/unique property when called
 * through the API to prevent unintentional data loss. 
 * 
 */
const remove = async (left: GraphNode) => {
    await connect(left.delete().query)
    return {
        statusCode: 204
    }
}


const join = (left: GraphNode, right: GraphNode) => {
    return {
        statusCode: 204
    }
}



//     # Generate the Cypher query
//     # pylint: disable=eval-used
//     cypher = Links(
//         label="Join",
//         **body
//     ).join(
//         *parse_as_nodes((
//             eval(root)(uuid=rootId),
//             eval(entity)(uuid=uuid)
//         ))
//     )

//     # Execute transaction and end session before reporting success
//     with db.session() as session:
//         session.write_transaction(lambda tx: tx.run(cypher.query))

//     return None, 204


const drop = async (left: GraphNode, right: GraphNode) => {
    const cypher = (new Link()).drop(left, right)
    await connect(cypher.query)
    return {
        statusCode: 204
    }
}

/**
 * Retrieve nodes that are linked with the left entity
 */
const topology = (left: IEntity, right: IEntity) => {
    // const link = new Link()
    // const cypher = link.query()

//     nodes = ({"cls": root, "id": rootId}, {"cls": entity})

//     # Pre-calculate the Cypher query
//     cypher = Links().query(*parse_as_nodes(nodes), "b")

//     with db.session() as session:
//         value = [*map(lambda x: x.serialize(), session.write_transaction(lambda tx: tx.run(cypher.query)))]

//     return {"@iot.count": len(value), "value": value}, 200
}



 /**
  * Browse saved results for a single model configuration. 
  * Results from different configurations are probably not
  * directly comparable, so we reduce the chances that someone 
  * makes wild conclusions comparing numerically
  * different models.
 
  * You can only access results for that test, although multiple collections * may be stored in a single place 
  */
export const handler: Handler = async ({ headers, body, httpMethod, path }) => {
    
    let user: GraphNode;
    try {
        const auth = headers["authorization"]
        const token = auth.split(":").pop();
        user = tokenClaim(token, process.env.SIGNING_KEY)
    } catch {
        return  {
            statusCode: 403,
            body: JSON.stringify({message: "Unauthorized"}),
            headers: { "Content-Type": "application/json"}
        }
    }

    const nodes = path
        .split("/")
        .filter((x: string) => !!x)
        .slice(1)
        .map(parseNode(JSON.parse(body ?? "{}")));

    switch (`${httpMethod}${nodes.length}`) {
        case "GET0":
            return catchAll(index)();
        case "GET1":
            return catchAll(metadata)(user, nodes[0])
        case "POST1":
            return catchAll(create)(user, nodes[0])
        // case "POST2":
        //     return catchAll(join)(nodes[0], nodes[1])
        case "PUT1":
            return catchAll(mutate)({ });
        case "DELETE1":
            return catchAll(remove)(nodes[0])
        case "OPTIONS0":
            return {
                statusCode: 204,
                headers: {"Allow": "OPTIONS,GET,POST,PUT,DELETE"}
            }
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({message: "Invalid HTTP Method"}),
                headers: { "Content-Type": "application/json"}
            }
    }
}