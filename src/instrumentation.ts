export async function register() {
  // Required so Next.js loads instrumentation (onRequestError).
}

export function onRequestError(
  error: { digest?: string } & Error,
  request: { path?: string },
  context: { routerKind?: string; routePath?: string; routeType?: string },
) {
  console.error("[onRequestError]", {
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
    routerKind: context.routerKind,
  });
}
