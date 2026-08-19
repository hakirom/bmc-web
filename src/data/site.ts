/**
 * Todo el copy de la página vive aquí (ES + EN) para que un cambio de texto no
 * obligue a tocar componentes. Contenido tomado de la home pública de
 * bolsamercantil.com.co (capturado 2026-08-19).
 */

export const utilityLinks = [
  'Boletines del mercado',
  'Información de Mercados',
  'PQRSF',
  'Línea ética',
  'Pague facturas negociadas',
]

export type MenuColumn = { title: string; links: string[] }

export const megaMenu: MenuColumn[] = [
  {
    title: 'Nuestra compañía',
    links: [
      'Nosotros',
      'Trabaje con nosotros',
      'BMC en medios',
      'Sostenibilidad',
      'Sociedades comisionistas',
      'Regulación',
      'Administración integral de riesgos',
      '¿Por qué invertir en nosotros?',
    ],
  },
  {
    title: 'Mercados',
    links: [
      'Mercado de Compras Públicas (MCP)',
      'Mercado de Comercialización entre privados (Mercop)',
      'Mercados Energéticos',
      'Programas Ministerio de Agricultura',
    ],
  },
  {
    title: 'Financiación e inversión',
    links: [
      'Registro de Facturas',
      'Repos sobre Certificados de Depósito de Mercancías - CDM',
      'Órdenes Irrevocables de Giro',
      'SIMM | Registro de cesión de derechos económicos',
    ],
  },
  {
    title: 'Información y análisis',
    links: [
      'Analítica',
      'Estudios Económicos',
      'Boletines del mercado',
      'Preguntas Frecuentes',
    ],
  },
]

export const hero = {
  eyebrow: '46 años de experiencia',
  title: 'Somos la bolsa de productos y servicios de Colombia.',
  subtitle:
    'Contribuimos al desarrollo sostenible y generamos valor al país promoviendo, facilitando y administrando mercados eficientes y financiación no bancaria a través de:',
  ctaPrimary: 'Conozca nuestros mercados',
  ctaSecondary: 'Acceso a plataformas',
  platforms: [
    {
      title: 'Plataforma de Negociación',
      body: 'En la BMC se compran y/o se venden bienes o servicios agropecuarios, agroindustriales, gas, energía, facturas, repos, otros commodities y títulos valores.',
      icon: 'exchange',
    },
    {
      title: 'Plataforma de Registro',
      body: 'En la BMC se registran convenios con entidades públicas, valores, títulos, derechos y servicios, bienes, productos y commodities, contratos y derivados.',
      icon: 'clipboard',
    },
    {
      title: 'Plataforma de Liquidación y Compensación',
      body: 'En la BMC compensamos y liquidamos las operaciones. Esto garantiza que se cumplan las obligaciones contraídas entre las partes, garantizando operaciones seguras.',
      icon: 'scale',
    },
    {
      title: 'Administración de Datos',
      body: 'En la BMC proveemos información y análisis al mercado para la toma oportuna de decisiones.',
      icon: 'chart',
    },
    {
      title: 'Administración de programas',
      body: 'En la BMC administramos programas del Ministerio de Agricultura y Desarrollo Rural para apoyar la ejecución de proyectos que apoyen la comercialización de commodities.',
      icon: 'sprout',
    },
  ],
}

/** Datos simulados para el tablero de mercado (la demo no consume APIs reales). */
export const marketBoard = {
  title: 'Cierre | Rueda de negocios',
  date: '19/08/2026',
  note: 'Cifras de demostración. No corresponden a operaciones reales del mercado.',
  summary: [
    { label: 'Número operaciones', value: '1.284' },
    { label: 'Valor negociado', value: '$ 412.965.331.204' },
  ],
  tabs: [
    {
      label: 'Mercado de físicos',
      columns: ['N° Negocio', 'Producto', 'Cantidad', 'Valor'],
      rows: [
        ['104882', 'Maíz amarillo', '520 t', '$ 1.842.300.000'],
        ['104883', 'Arroz paddy verde', '310 t', '$ 1.129.500.000'],
        ['104884', 'Azúcar sulfitada', '180 t', '$ 742.680.000'],
        ['104885', 'Aceite crudo de palma', '95 t', '$ 613.225.000'],
        ['104886', 'Café pergamino seco', '64 t', '$ 1.036.400.000'],
        ['104887', 'Gas natural', '1.200 MBTU', '$ 268.940.000'],
      ],
    },
    {
      label: 'Mercado de financieros',
      columns: ['N° Negocio', 'Instrumento', 'Valor', 'Tasa E.A.'],
      rows: [
        ['F-20114', 'Registro de facturas', '$ 8.420.115.000', '13,85 %'],
        ['F-20115', 'Repo sobre CDM', '$ 5.310.000.000', '12,40 %'],
        ['F-20116', 'Orden Irrevocable de Giro', '$ 2.905.780.000', '11,95 %'],
        ['F-20117', 'Registro de facturas', '$ 1.640.220.000', '14,10 %'],
        ['F-20118', 'Repo sobre CDM', '$ 980.500.000', '12,75 %'],
        ['F-20119', 'SIMM | Cesión de derechos', '$ 745.300.000', '13,20 %'],
      ],
    },
  ],
  cta: 'Más información del mercado',
}

export const servicesSection = {
  eyebrow: 'Nuestros servicios',
  title: 'Brindamos transparencia, seguridad y eficiencia en los mercados que administramos.',
  intro:
    'Somos un escenario de negociación de productos agropecuarios, industriales, minero-energéticos y otros commodities, donde se puede comprar o vender productos, obtener financiación o hacer inversiones.',
  groups: [
    {
      title: 'Mercados',
      body: 'Administramos mercados especializados para la comercialización de productos y servicios, atendiendo las necesidades de compra y/o venta de Entidades estatales, empresas privadas o mixtas y personas naturales.',
      icon: 'exchange',
      links: [
        'Mercado de Compras Públicas (MCP)',
        'Mercado de Comercialización entre privados (Mercop)',
        'Mercados Energéticos',
      ],
    },
    {
      title: 'Financiación no bancaria y productos de inversión',
      body: 'Promovemos fuentes de financiación no bancaria de fácil acceso.',
      icon: 'coins',
      links: [
        'Registro de Facturas',
        'Repos sobre Certificados de Depósito de Mercancías - CDM',
        'Órdenes Irrevocables de Giro',
        'SIMM | Registro de cesión de derechos económicos',
      ],
    },
    {
      title: 'Información y análisis',
      body: 'Proveemos información y análisis al mercado para la toma oportuna de decisiones.',
      icon: 'chart',
      links: ['Analítica', 'Estudios Económicos'],
    },
    {
      title: 'Administración de Programas',
      body: 'En la BMC administramos programas del Ministerio de Agricultura y Desarrollo Rural para apoyar la ejecución de proyectos que apoyen la comercialización de commodities.',
      icon: 'sprout',
      links: ['Programas Ministerio de Agricultura'],
    },
  ],
}

export const valueSection = {
  eyebrow: '¿Cómo agregamos valor a Colombia?',
  slides: [
    'Damos acceso al mercado a PYMES para que vendan sus productos y servicios a grandes empresas y al Estado.',
    'Administramos, creamos y facilitamos mercados eficientes desde el sector agropecuario, el energético hasta el de compras públicas, permitiendo la formación transparente y eficiente de precios, contribuyendo así a la competitividad del país.',
    'Cubrimos fallas de mercado en materia de financiación, facilitando financiación no bancaria para el sector agropecuario, proveedores del Estado y pequeñas y medianas empresas.',
    'Nuestros escenarios de negociación son independientes, transparentes, neutros y objetivos.',
    'Somos aliados del Estado en la lucha contra la corrupción y el ahorro de los recursos públicos con nuestro mercado de compras públicas que es eficiente, transparente y seguro.',
  ],
}

export const stats = [
  { value: '46', label: 'años de experiencia' },
  { value: '+3.500', label: 'entidades y empresas atendidas' },
  { value: '+40', label: 'sociedades comisionistas' },
  { value: '24/7', label: 'plataformas de registro disponibles' },
]

export const contact = {
  eyebrow: 'Contáctenos',
  cards: [
    {
      title: 'Contáctenos',
      icon: 'phone',
      links: ['Contáctenos por WhatsApp', 'Escríbanos', 'Línea ética'],
      cta: 'Conoce más',
    },
    {
      title: 'Atención al Cliente',
      icon: 'headset',
      links: ['Plataforma PQRSF', 'Preguntas Frecuentes'],
      cta: 'Ir a PQRSF',
    },
    {
      title: 'Visítenos',
      icon: 'pin',
      links: ['Calle 113 # 7-21 Torre A Piso 15.', 'Edif. Teleport Business Park', 'Bogotá D.C., Colombia'],
      cta: 'Ver en el mapa',
    },
  ],
}

export const footer = {
  columns: [
    {
      title: 'Nuestra compañía',
      links: [
        'Nosotros',
        'Trabaje con nosotros',
        'BMC en medios',
        'Sostenibilidad',
        'Sociedades comisionistas',
        'Regulación',
        'Administración integral de riesgos',
        '¿Por qué invertir en nosotros?',
      ],
    },
    {
      title: 'Productos',
      links: [
        'MCP',
        'MERCOP',
        'Mercados energéticos',
        'Repos sobre CDM',
        'Registro de facturas',
        'OIG',
        'Programas MADR',
        'Analítica',
        'Estudios económicos',
        'SIMM | Registro de cesión de derechos económicos',
      ],
    },
    {
      title: 'Políticas',
      links: [
        'Términos y condiciones de uso',
        'Política de privacidad',
        'Línea Ética',
        'Política del Sistema de Gestión Integrado',
        'Política de Seguridad de la Información',
      ],
    },
    {
      title: 'Autorregulación',
      links: ['Cámara Disciplinaria', 'Área de Seguimiento', 'Contáctenos', 'PQRSF', 'Preguntas Frecuentes'],
    },
  ],
  certifications: [
    { label: 'Certificado:', value: 'TR-CO22.07533' },
    { label: 'Certificado:', value: 'TR-CO22.07748' },
    { label: 'Certificado:', value: 'CN-2002544' },
  ],
  supervision: 'Vigilada: Superintendencia Financiera de Colombia',
  listed: 'Listado en: BVC',
  legal: 'Derechos Reservados 2026 Bolsa Mercantil de Colombia S.A. - Bogotá D.C., Colombia',
  socials: ['LinkedIn', 'X', 'YouTube', 'Facebook', 'Instagram'],
}
