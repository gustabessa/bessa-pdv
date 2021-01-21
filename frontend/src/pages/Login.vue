<template>
  <q-page class="flex flex-center">
    <q-card class="login-cadastro">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input :color='themeInput' outlined v-model="username" label="Usuário" />
          <q-input :color='themeInput' outlined v-model="password" class="q-mt-md" label="Senha" :type="isPwd ? 'password' : 'text'" @keyup.enter="efetuarLogin">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                :style="themeText"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="text-white">
          <q-btn :class="theme" style="width: 50%;" label="Entrar" :loading="loading" @click="efetuarLogin()" />
        </q-card-actions>
        <q-card-section class="text-center">
          Não possui conta? <a href="/#/cadastro" :style="themeText">Cadastre-se!</a>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  data () {
    return {
      loading: false,

      username: '',
      password: '',
      isPwd: true
    }
  },
  methods: {
    efetuarLogin () {
      this.loading = true
      const user = {
        usuario: this.username,
        senha: this.password
      }
      httpUtil.doPost('/api/auth', user,
        data => {
          if (data && !data.hasError) {
            this.$router.push('/')
          } else if (data.hasError) {
            console.error(data.techError)
            this.$q.notify({
              type: 'negative',
              message: data.messageError,
              timeout: 2000
            })
          }
          this.loading = false
        },
        err => {
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao autenticar.',
            timeout: 2000
          })
          this.loading = false
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
    }
  }
}
</script>
<style>
  .login-card {
    height: 500px;
    width: 500px;
    border: solid 1px;
    border-radius: 5em;
  }
</style>
