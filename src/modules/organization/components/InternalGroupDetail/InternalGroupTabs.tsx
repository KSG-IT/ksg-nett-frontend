import { Tabs } from '@mantine/core'
import { PermissionGate } from 'components/PermissionGate'
import { InternalGroupNode } from 'modules/organization/types'
import { PERMISSIONS } from 'util/permissions'
import { InternalGroupEditForm } from './InternalGroupEditForm'
import { InternalGroupInfo } from './InternalGroupInfo'
import { InternalGroupUserHighlights } from './InternalGroupUserHighlights'

interface InternalGroupTabsProps {
  internalGroup: InternalGroupNode
}
export const InternalGroupTabs: React.FC<InternalGroupTabsProps> = ({
  internalGroup,
}) => {
  return (
    <Tabs defaultValue="info">
      <Tabs.List>
        <Tabs.Tab value="info">Info</Tabs.Tab>
        <Tabs.Tab value="highlights">{internalGroup?.highlightedName}</Tabs.Tab>
        <PermissionGate
          permissions={PERMISSIONS.organization.change.internalGroup}
        >
          <Tabs.Tab value="settings">Innstillinger</Tabs.Tab>
        </PermissionGate>
      </Tabs.List>

      <Tabs.Panel value="info" pt="xs">
        <InternalGroupInfo internalGroup={internalGroup} />
      </Tabs.Panel>

      <Tabs.Panel value="highlights" pt="xs">
        <InternalGroupUserHighlights internalGroupId={internalGroup.id} />
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        <InternalGroupEditForm internalGroup={internalGroup} />
      </Tabs.Panel>
    </Tabs>
  )
}
