export const ROUTES = [
  // { index: 0, path: "/", component: Home },
  // { index: 1, path: "/dashboard", component: Dashboard },
  // { index: 2, path: "/news", component: News },
  { index: 0, path: '/', component: <div /> },
]
export const SWIPEABLE_ROUTES = ROUTES.filter((route) => route.index !== -1)
