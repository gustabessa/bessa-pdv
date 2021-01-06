<template>
  <q-page class="flex flex-center">
    <q-card class="login-cadastro">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined v-model="username" label="Usuário" />
          <q-input outlined v-model="password" class="q-mt-md" label="Senha" :type="isPwd ? 'password' : 'text'" @keyup.enter="efetuarLogin">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn style="width: 50%;" class="btn-purple" label="Entrar" :loading="loading" @click="efetuarLogin()" />
        </q-card-actions>
        <q-card-section class="text-center">
          Não possui conta? <a href="/#/cadastro" class="text-primary">Cadastre-se!</a>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'

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
          this.$router.push('/')
          this.loading = false
        },
        err => {
          this.$q.notify({
            type: 'negative',
            message: err,
            timeout: 2000
          })
          this.loading = false
        })
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
