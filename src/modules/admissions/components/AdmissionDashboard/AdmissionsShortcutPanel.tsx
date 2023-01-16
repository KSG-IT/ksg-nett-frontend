import {
  IconAbacus,
  IconCheck,
  IconPokeball,
  IconUsers,
  IconUserSearch,
  IconWheelchair,
} from '@tabler/icons'
import { ShortcutCardGrid } from 'components/ShortcutCard'

const shortcuts = [
  {
    title: 'Mine intervjuer',
    icon: IconPokeball,
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
    title: 'Intervjuoversikt',
    icon: IconAbacus,
    color: 'samfundet-red',
    link: '/admissions/interviews-overview',
    permissions: 'admissions.view_interview',
  },
  {
    title: 'Fullførte intervjuer',
    icon: IconCheck,
    color: 'samfundet-red',
    link: '/admissions/finished-interviews',
  },
]

export const AdmissionsShortcutPanel: React.FC<{}> = () => {
  return <ShortcutCardGrid shortcuts={shortcuts} />
}
