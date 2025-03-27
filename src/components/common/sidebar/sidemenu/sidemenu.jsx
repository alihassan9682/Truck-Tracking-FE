export const MENUITEMS = [
  {
    menutitle: 'MAIN',
  },
  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    dirchange: false,
    title: 'Dashboards',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `/`, type: 'link', active: false, selected: false, dirchange: false, title: '' },
    ]
  },

  {
    menutitle: "AUTHENTICATION",
  },
  {
    title: "Authentication",
    icon: (
      <i className="bx bx-lock side-menu__icon"></i>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `/login`,
        title: "Login",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `/signup`,
        title: "Sign Up",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
];