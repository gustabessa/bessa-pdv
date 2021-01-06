<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          flat
          dense
          round
          v-if="isLogged"
          icon="logout"
          @click="logout()"
        />

        <q-toolbar-title>
          Bessa PDV
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Páginas
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Home',
    // caption: 'quasar.dev',
    // icon: 'school',
    link: '/'
  },
  {
    title: 'Login',
    // caption: 'quasar.dev',
    // icon: 'school',
    link: '/login'
  },
  {
    title: 'Produtos',
    // caption: 'quasar.dev',
    // icon: 'school',
    link: '/produtos'
  },
  {
    title: 'Venda',
    // caption: 'quasar.dev',
    // icon: 'school',
    link: '/venda'
  },
  {
    title: 'Relatório de Vendas',
    // caption: 'quasar.dev',
    // icon: 'school',
    link: '/relatorio-venda'
  }
]
import httpUtil from '../components/util/HttpUtil'

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      tokenApi: window.localStorage.getItem('tokenApi'),
      isLogged: this.tokenApi !== null && this.tokenApi !== 'null' && this.tokenApi !== undefined && this.tokenApi !== 'undefined'
    }
  },
  methods: {
    logout () {
      httpUtil.doGet('/api/auth',
        () => {
          this.$q.notify({
            type: 'positive',
            message: 'Deslogado com sucesso!',
            timeout: 2000
          })
          this.$router.push('/login')
        },
        err => {
          this.$q.notify({
            type: 'negative',
            message: err,
            timeout: 2000
          })
        })
    }
  },
  beforeUpdate () {
    this.tokenApi = window.localStorage.getItem('tokenApi')
    this.isLogged = this.tokenApi !== null && this.tokenApi !== 'null' && this.tokenApi !== undefined && this.tokenApi !== 'undefined'
  }
}
</script>
