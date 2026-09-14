export function notFound(req, res) {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("[error]", err);
  }

  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
  });
}
