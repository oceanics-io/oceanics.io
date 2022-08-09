"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bathysphere_json_1 = __importDefault(require("./shared/bathysphere.json"));
const middleware_1 = require("./shared/middleware");
const wasm_1 = require("wasm");
/**
 * Create a new account using email address. We don't perform
 * any validation of inputs here, such as for email address and
 * excluded passwords. Assume this is delegated to frontend.
 */
const register = async ({ data: { user, provider } }) => {
    const { query } = new wasm_1.Links("Register", 0, 0, "").insert(provider, user);
    let records;
    try {
        records = await (0, middleware_1.connect)(query).then(middleware_1.transform);
    }
    catch {
        records = [];
    }
    if (records.length !== 1)
        return middleware_1.UNAUTHORIZED;
    return {
        data: { message: `Registered as a member of ${records[0].domain}.` },
        statusCode: 200
    };
};
/**
 * Exchange user name and password for JWT. In addition to the usual encoded
 * data per the standard, it includes the UUID for the User, as this is the
 * information needed when validating access to data.
 */
const getToken = async ({ data: { user } }) => {
    const [{ uuid }] = (0, middleware_1.dematerialize)(user);
    return {
        statusCode: 200,
        data: {
            token: jsonwebtoken_1.default.sign({ uuid }, process.env.SIGNING_KEY, { expiresIn: 3600 })
        }
    };
};
// Just a stub for now, to enable testing of bearer auth
const manage = async ({}) => {
    return {
        statusCode: 501
    };
};
const remove = async ({ data: { user } }) => {
    const { query } = new wasm_1.Links().delete(user, new wasm_1.Node());
    try {
        await (0, middleware_1.connect)(query);
    }
    catch (error) {
        console.error({
            user,
            error
        });
        return middleware_1.UNAUTHORIZED;
    }
    return {
        statusCode: 204
    };
};
/**
 * Auth Router
 */
exports.handler = (0, middleware_1.NetlifyRouter)({
    GET: getToken,
    POST: register,
    PUT: manage,
    DELETE: remove,
}, bathysphere_json_1.default.paths["/auth"]);