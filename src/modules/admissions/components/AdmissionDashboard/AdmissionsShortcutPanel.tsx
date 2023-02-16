import {
  IconAbacus,
  IconCheck,
  IconPokeball,
  IconSailboat,
  IconUsers,
  IconUserSearch,
  IconWheelchair,
} from '@tabler/icons'
import { ShortcutCardGrid } from 'components/ShortcutCard'

const shortcuts = [
  {
    title: 'Mine intervjuer',
    icon: IconPokeball,
    link: '/admissions/my-interviews',
  },
  {
    title: 'Søkeroversikt',
    icon: IconUsers,
    link: '/admissions/applicants-overview',
  },
  {
    title: 'Oppfølging',
    icon: IconUserSearch,
    link: '/admissions/applicant-notices',
  },
  {
    title: 'Intervjuoversikt',
    icon: IconAbacus,
    link: '/admissions/interviews-overview',
    permissions: 'admissions.view_interview',
  },
  {
    title: 'Fullførte intervjuer',
    icon: IconCheck,
    link: '/admissions/finished-interviews',
  },
  {
    title: 'Statistiskk',
    icon: IconSailboat,
    link: '/admissions/statistics',
  },
]

export const AdmissionsShortcutPanel: React.FC<{}> = () => {
  return <ShortcutCardGrid shortcuts={shortcuts} />
}
