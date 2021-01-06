// import something here
import httpUtil from '../components/util/HttpUtil'
import { Notify } from 'quasar'
const publicPath = ['/cadastro', '/login', '/']
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (publicPath.indexOf(to.path) < 0) {
      httpUtil.doGet('/api/auth/check',
        () => {
          checkTokenApi(to, from, next)
        },
        err => {
          Notify.create({
            type: 'negative',
            message: err,
            timeout: 2000
          })
          checkTokenApi(to, from, next)
        }
      )
    } else {
      next()
    }
  })
}

function checkTokenApi (to, from, next) {
  const tokenApi = window.localStorage.getItem('tokenApi')
  if ((!tokenApi || tokenApi === 'null') && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
}
