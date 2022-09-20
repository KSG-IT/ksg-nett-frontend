import { UserNode } from 'modules/users'
import { useCallback, useMemo } from 'react'
import { useStore } from 'store'

type OnlyRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export function usePermissions() {
  const me = useStore(state => state.user)

  const hasPermissions = useCallback(
    (permissions: string | string[], allowAdmin: boolean = false) =>
      me.isSuperuser ||
      allowAdmin ||
      ([] as string[])
        .concat(permissions)
        .every(perm => me.allPermissions.includes(perm)),
    [me.allPermissions, me.isSuperuser]
  )

  const hasPermissionsOrMe = useCallback(
    (user: Pick<UserNode, 'id'> | null, ...permissions: string[]) =>
      user && (hasPermissions(permissions) || user.id === me.id),
    [me.id, hasPermissions]
  )

  const hasPermissionsAndMe = useCallback(
    (user: Pick<UserNode, 'id'> | null, ...permissions: string[]) =>
      user && hasPermissions(permissions) && user.id === me.id,
    [me.id, hasPermissions]
  )
  console.table(me.allPermissions)
  console.table(me)

  const perms = useMemo(
    () => ({
      permissions: me.allPermissions,
      hasPermissions,
      hasPermissionsOrMe,
      hasPermissionsAndMe,
    }),
    [hasPermissions, hasPermissionsOrMe, hasPermissionsAndMe, me.allPermissions]
  )

  return perms
}

export function useProfileAccess(user: OnlyRequired<UserNode, 'id'>) {
  const me = useStore(store => store.user)
  const myProfile = user.id === me.id
  const canAccessProfile = myProfile

  return canAccessProfile
}
