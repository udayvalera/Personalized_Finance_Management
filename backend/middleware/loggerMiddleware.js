const loggerMiddleware = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;

  // ANSI escape codes for colors
  const reset = "\x1b[0m"; // Reset color
  const cyan = "\x1b[36m"; // Cyan for method
  const yellow = "\x1b[33m"; // Yellow for URL

  // Dynamic padding calculations with non-negative constraints
  const methodPadding = " ".repeat(Math.max(0, 7 - method.length)); // Ensures non-negative padding
  const maxUrlLength = 30;
  const truncatedUrl =
    url.length > maxUrlLength
      ? url.substring(0, maxUrlLength - 3) + "..."
      : url;
  const urlPadding = " ".repeat(
    Math.max(0, maxUrlLength - truncatedUrl.length)
  );

  // Log the request in tabular format with colors
  console.log(
    `${cyan}| ${method}${methodPadding}|${reset} ${yellow}${truncatedUrl}${urlPadding}|${reset}`
  );

  next();
};

module.exports = loggerMiddleware;
