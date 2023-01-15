import {
  IconAbacus,
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
]

export const AdmissionsShortcutPanel: React.FC<{}> = () => {
  return <ShortcutCardGrid shortcuts={shortcuts} />
}
