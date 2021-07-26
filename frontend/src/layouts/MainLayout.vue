<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar :class="theme">
        <div>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="gerenciarGaveta"
          />
          <q-tooltip>
            {{ leftDrawerOpen ? 'Fechar menu' : 'Abrir menu'}}
          </q-tooltip>
        </div>
        <div>
          <q-btn
            flat
            dense
            round
            v-if="isLogged"
            icon="logout"
            @click="logout()"
          />
          <q-tooltip>
            Logout
          </q-tooltip>
        </div>

        <q-toolbar-title>
          Bessa PDV
        </q-toolbar-title>

        <div>
          <q-btn
            flat
            dense
            round
            icon="palette"
            @click="escolheTema()"
          />
          <q-tooltip>
            Escolher tema
          </q-tooltip>
        </div>
        <div>
          <q-btn
            flat
            dense
            round
            icon="settings"
            @click="configuracoes()"
          />
          <q-tooltip>
            Configurações
          </q-tooltip>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :content-style="menuStyle"
      :width="200"
    >
      <q-list>
        <q-item-label
          header
          class="menu-header"
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

    <q-page-container :style="pageBackground">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
const linksData = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'Login',
    link: '/login'
  },
  {
    title: 'Produtos',
    link: '/produtos'
  },
  {
    title: 'Venda',
    link: '/venda'
  },
  {
    title: 'Relatório de Vendas',
    link: '/relatorio-venda'
  }
]
import httpUtil from '../components/util/HttpUtil'
import EscolhaTema from '../components/EscolhaTema'
import Configuracoes from '../components/Configuracoes'

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
    },
    gerenciarGaveta () {
      this.leftDrawerOpen = !this.leftDrawerOpen
      this.timeoutFecharGaveta()
    },
    timeoutFecharGaveta () {
      if (this.leftDrawerOpen) {
        setTimeout(() => {
          this.leftDrawerOpen = false
        }, 10000)
      }
    },
    escolheTema () {
      this.$q.dialog({
        component: EscolhaTema,
        parent: this
      })
    },
    configuracoes () {
      this.$q.dialog({
        component: Configuracoes,
        parent: this
      })
    }
  },
  computed: {
    theme () {
      return themeUtil.getTheme(this.$store)
    },
    themeText () {
      return {
        color: scss[themeUtil.getTheme(this.$store)]
      }
    },
    themeInput () {
      return scss[themeUtil.getTheme(this.$store)]
    },
    menuStyle () {
      return {
        background: scss['menu-' + themeUtil.getTheme(this.$store)],
        'border-right-color': scss['menu-' + themeUtil.getTheme(this.$store)],
        backgroundColor: scss['menu-' + themeUtil.getTheme(this.$store)],
        color: scss['text-color']
      }
    },
    pageBackground () {
      return {
        backgroundColor: scss['background-' + themeUtil.getTheme(this.$store)]
      }
    }
  },
  mounted () {
    this.timeoutFecharGaveta()
  },
  beforeUpdate () {
    this.tokenApi = window.localStorage.getItem('tokenApi')
    this.isLogged = this.tokenApi !== null && this.tokenApi !== 'null' && this.tokenApi !== undefined && this.tokenApi !== 'undefined'
  }
}
</script>
<style lang="scss">
  .menu-header {
    color: $text-color;
    font-weight: 700;
    font-size: 20px;
  }
</style>
