export function errorHandler(error, request, response, _next) {
  console.error({ requestId: request.requestId, error: error.message });
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  response.status(status).json({ error: status >= 500 ? "internal_server_error" : error.message, requestId: request.requestId });
}
