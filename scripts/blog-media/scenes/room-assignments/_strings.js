// Board data is shared: [floor, [[attendant, kind, vip?], ...]].
// Attendants: a = Ana, r = Rosa, l = Lupita. Kinds: d = departure/checkout, s = stayover.
// Credits (checkout 2, stayover 1): Ana 6d 2s = 14, Rosa 5d 4s = 14, Lupita 6d 2s = 14.
export const FLOORS = [
  ['3', [['a', 'd', true], ['a', 'd'], ['a', 's'], ['a', 'd'], ['a', 's'], ['a', 'd'], ['a', 'd']]],
  ['4', [['r', 'd'], ['r', 's'], ['r', 'd'], ['r', 's'], ['r', 'd'], ['r', 's'], ['r', 'd']]],
  ['5', [['l', 'd'], ['l', 's'], ['l', 'd'], ['l', 'd'], ['l', 's'], ['l', 'd']]],
  ['6', [['a', 'd'], ['r', 'd'], ['r', 's'], ['l', 'd'], ['l', 'd']]],
];

export const STRINGS = {
  es: {
    kicker: 'Guía',
    name: ['Cada camarista.', 'Carga pareja.'],
    line: 'Un tablero diario para repartir las habitaciones de forma justa.',
    tag: 'Tablero · Mié 18',
    count: '25 hab.',
    floor: 'P',
    kinds: { d: 'S', s: 'O' },
    legend: [['d', 'S salida'], ['s', 'O ocupada'], ['vip', 'VIP primero']],
    board: 'Créditos por camarista',
    sub: 'Salida 2 · Ocupada 1',
    people: [
      ['a', 'Ana', 'P3 + P6 · 8 hab.', '14 cr'],
      ['r', 'Rosa', 'P4 + P6 · 9 hab.', '14 cr'],
      ['l', 'Lupita', 'P5 + P6 · 8 hab.', '14 cr'],
    ],
    sick: ['Marta', 'Avisó enferma · 6:50', 'Repartida'],
    taskTitle: 'Falta cubierta',
    taskSub: 'Las 5 hab. de Marta, entre 3',
    taskBy: 'Sofía · supervisora 7:42',
    badge: 'Rol liberado',
    chip: 'Guías',
    title: 'Cómo asignar habitaciones a las camaristas de forma justa',
    meta: 'Guía · Whagons',
  },
  en: {
    kicker: 'Guide',
    name: ['Every attendant.', 'A fair load.'],
    line: 'A simple daily room board to split the rooms fairly.',
    tag: 'Room board · Wed 18',
    count: '25 rooms',
    floor: 'F',
    kinds: { d: 'D', s: 'S' },
    legend: [['d', 'D departure'], ['s', 'S stayover'], ['vip', 'VIP first']],
    board: 'Credits per attendant',
    sub: 'Checkout 2 · Stayover 1',
    people: [
      ['a', 'Ana', 'F3 + F6 · 8 rooms', '14 cr'],
      ['r', 'Rosa', 'F4 + F6 · 9 rooms', '14 cr'],
      ['l', 'Lupita', 'F5 + F6 · 8 rooms', '14 cr'],
    ],
    sick: ['Marta', 'Sick call · 6:50', 'Split'],
    taskTitle: 'Sick call covered',
    taskSub: "Marta's 5 rooms split 3 ways",
    taskBy: 'Sofía · supervisor 7:42',
    badge: 'Board released',
    chip: 'Guides',
    title: 'How to assign housekeeping rooms fairly: a simple daily room board',
    meta: 'Guide · Whagons',
  },
};
