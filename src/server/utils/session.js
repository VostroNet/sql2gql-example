import session from "express-session";
import Promise from "bluebird";
Promise.promisifyAll(session.Session.prototype);
export default session;
