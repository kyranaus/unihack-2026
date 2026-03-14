import { b as createRouterClient } from "../_libs/orpc__server.mjs";
import { c as createRouterUtils } from "../_libs/orpc__tanstack-query.mjs";
import { r as router$2 } from "./router-DL5qrXNE.mjs";
import { g as getRequestHeaders } from "./server-BubZoQFo.mjs";
const getORPCClient = () => createRouterClient(router$2, {
  context: () => ({
    headers: getRequestHeaders()
  })
});
const client = getORPCClient();
createRouterUtils(client);
export {
  client as c
};
