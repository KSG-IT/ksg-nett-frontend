// The sidebar link to mark for a path: the longest link that is the path, or
// a part of it that ends at a "/". So /schedules/abc/v2 marks "Vaktplaner",
// and /schedules/me marks "Mine vakter", not "Vaktplaner".
export function activeLink(pathname: string, links: string[]): string | null {
  const matches = links.filter(
    link => pathname === link || pathname.startsWith(`${link}/`)
  )
  return matches.sort((a, b) => b.length - a.length)[0] ?? null
}
