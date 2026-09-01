import { addDays, subDays } from 'date-fns'
import { AllergyUser } from '../types'

export interface MockShiftDay {
  date: Date
  users: AllergyUser[]
}

const today = new Date()

export const MOCK_ALLERGY_DATA: MockShiftDay[] = [
  {
    date: subDays(today, 1),
    users: [
      { name: 'Kari Nordmann', allergies: ['Nøtter', 'Skalldyr'] },
      { name: 'Lars Bakken', allergies: ['Gluten', 'Skalldyr'] },
      { name: 'Ingrid Lie', allergies: [] },
    ],
  },
  {
    date: today,
    users: [
      {
        name: 'Alexander Orvik',
        allergies: ['Peanøtter', 'Gluten/Edamamebønner'],
      },
      {
        name: 'Sebastian Småland',
        allergies: ['Peanøtter', 'Løk', 'Gluten/Edamamebønner'],
      },
      { name: 'Marie Hansen', allergies: [] },
      { name: 'Jonas Berg', allergies: ['Hvete'] },
      { name: 'Sofie Dahl', allergies: ['Løk'] },
    ],
  },
  {
    date: addDays(today, 1),
    users: [
      { name: 'Ingrid Bakke', allergies: ['Laktose', 'Gluten'] },
      {
        name: 'Anders Holm',
        allergies: ['Nøtter: literally dør', 'Hasselnøtter', 'Pinjekjerner'],
      },
      { name: 'Nora Lie', allergies: ['Laktose', 'Gluten', 'Soya'] },
      { name: 'Emma Johansen', allergies: ['Melk', 'Egg', 'Soya'] },
      { name: 'Silje Haugen', allergies: ['FODMAP', 'Løk', 'Purreløk'] },
      { name: 'Eirik Sørensen', allergies: ['Laktose', 'Nøtter: tåler spor'] },
      {
        name: 'Vegard Hansen',
        allergies: ['Nøtter: literally dør', 'Valnøtter'],
      },
      { name: 'Maria Christensen', allergies: ['Gluten', 'Egg'] },
      { name: 'Sara Pedersen', allergies: ['Gluten', 'Soya'] },
      { name: 'Marte Olsen', allergies: ['Egg', 'Melk'] },
      { name: 'Lars Eriksen', allergies: ['Nøtter: tåler spor'] },
      { name: 'Thea Nilsen', allergies: ['Laktose'] },
      { name: 'Julie Dahl', allergies: ['Veganer'] },
      { name: 'Petter Aas', allergies: ['Scampi', 'Kamskjell'] },
      { name: 'Ida Lindqvist', allergies: ['Laktose', 'Sopp'] },
      { name: 'Ole Martin Strand', allergies: ['Avokado', 'Sitrus'] },
      { name: 'Kristian Andersen', allergies: [] },
      { name: 'Magnus Berg', allergies: [] },
      { name: 'Håkon Moen', allergies: [] },
      { name: 'Thomas Knutsen', allergies: [] },
    ],
  },
  {
    date: addDays(today, 2),
    users: [
      { name: 'Petter Stordalen', allergies: ['Nøtter'] },
      { name: 'Mia Halvorsen', allergies: ['Melk', 'Nøtter'] },
    ],
  },
  {
    date: addDays(today, 3),
    users: [
      { name: 'Silje Holm', allergies: ['Hvete', 'Egg'] },
      { name: 'Erik Solberg', allergies: [] },
      { name: 'Camilla Vold', allergies: ['Hvete'] },
    ],
  },
  {
    date: addDays(today, 4),
    users: [
      { name: 'Silje Holm', allergies: [] },
      { name: 'Erik Solberg', allergies: [] },
      { name: 'Camilla Vold', allergies: [] },
    ],
  },
  {
    date: addDays(today, 5),
    users: [
      { name: 'Silje Holm', allergies: ['Egg'] },
      { name: 'Erik Solberg', allergies: ['Hvete', 'Egg'] },
      { name: 'Silje Holm', allergies: ['Hvete', 'Egg'] },
    ],
  },
]
