import {
  Icon3dCubeSphere,
  IconSun,
  IconUsers,
  IconUserSearch,
  IconWheelchair,
} from '@tabler/icons'
import { ShortcutCardGrid } from 'components/ShortcutCard'

const shortcuts = [
  {
    title: 'Mine intervjuer',
    icon: IconWheelchair,
    color: 'samfundet-red',
    link: '/admissions/my-interviews',
  },
  {
    title: 'Søkeroversikt',
    icon: IconUsers,
    color: 'samfundet-red',
    link: '/admissions/applicants-overview',
  },
  {
    title: 'Oppfølging',
    icon: IconUserSearch,
    color: 'samfundet-red',
    link: '/admissions/applicant-notices',
  },
  {
    title: 'Intervjuallokering',
    icon: Icon3dCubeSphere,
    color: 'samfundet-red',
    link: '/admissions/assign-interview',
  },
  {
    title: 'Dagens intervjuer',
    icon: IconSun,
    color: 'samfundet-red',
    link: '/admissions/todays-interviews',
  },
]

export const AdmissionsShortcutPanel: React.FC<{}> = () => {
  return <ShortcutCardGrid shortcuts={shortcuts} />
}
