import crypto from "node:crypto";

export function requestContext(request, response, next) {
  const requestId = request.get("x-request-id") || crypto.randomUUID();
  response.setHeader("x-request-id", requestId);
  request.requestId = requestId;
  next();
}
