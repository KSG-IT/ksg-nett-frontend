// Detects that a newer build is deployed. vite.config.mts writes the build id
// into the bundle (BUILD_ID) and into /version.json. The server sends
// version.json with `Cache-Control: no-cache` (deploy.sh).

export function parseBuildId(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null
  const buildId = (data as { buildId?: unknown }).buildId
  return typeof buildId === 'string' && buildId !== '' ? buildId : null
}

export function isNewBuild(
  currentBuildId: string,
  deployedBuildId: string | null
) {
  return deployedBuildId !== null && deployedBuildId !== currentBuildId
}

export async function fetchDeployedBuildId(): Promise<string | null> {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!response.ok) return null
    return parseBuildId(await response.json())
  } catch {
    // Offline, or the file is missing. Try again at the next check.
    return null
  }
}
