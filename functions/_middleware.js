// Cloudflare Pages Middleware
// Redirects any request ending in a trailing slash (except root "/")
// to the same URL without the trailing slash, preserving query strings.

export const onRequest = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only redirect if the path is not root and ends with "/"
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url.toString(), 301);
  }

  return next();
};
