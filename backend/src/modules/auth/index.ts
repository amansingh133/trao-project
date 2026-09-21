// Public surface of the auth module — anything another module needs from
// auth (its router, its request-guard middleware) comes through here rather
// than reaching into auth's internal files directly.
export { authRouter } from "./auth.routes.js";
export { requireAuth } from "./auth.middleware.js";
export { User } from "./auth.model.js";
