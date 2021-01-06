
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'cadastro', component: () => import('pages/Cadastro.vue') },
      { path: 'produtos', component: () => import('pages/Produtos.vue') },
      { path: 'venda', component: () => import('pages/Venda.vue') },
      { path: 'relatorio-venda', component: () => import('pages/RelatorioVenda.vue') }
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Login.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
