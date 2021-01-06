<template>
  <q-page class="flex flex-center">
    <q-card class="login-cadastro">
        <q-card-section>
          <div class="text-h6">Cadastro</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined v-model="nomeEmpresa" label="Nome da Empresa" />
          <q-input outlined v-model="usuario" class="q-mt-md" label="Usuário" />
          <q-input outlined v-model="senha" class="q-mt-md" label="Senha" :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input outlined v-model="email" class="q-mt-md" label="Email" />
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn style="width: 40%;" outline class="btn-purple-inverse" label="Limpar" @click="limparCampos()" />
          <q-btn style="width: 40%;" class="btn-purple" label="Salvar" :loading="loading" @click="criarUsuario()" />
        </q-card-actions>
      </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'

export default {
  data () {
    return {
      loading: false,

      usuario: '',
      nomeEmpresa: '',
      senha: '',
      email: '',
      isPwd: true
    }
  },
  methods: {
    limparCampos () {
      this.usuario = ''
      this.senha = ''
      this.nomeEmpresa = ''
      this.email = ''
    },
    criarUsuario () {
      this.loading = true
      const userVO = {
        usuario: this.usuario,
        senha: this.senha,
        email: this.email,
        nomeEmpresa: this.nomeEmpresa
      }
      httpUtil.doPost('/api/user', userVO,
        data => {
          this.$q.notify({
            type: 'positive',
            message: 'Usuário cadastrado com sucesso!',
            timeout: 2000
          })
          this.$router.push('/login')
          this.loading = false
        },
        err => {
          this.$q.notify({
            type: 'negative',
            message: err,
            timeout: 2000
          })
          this.loading = false
        }
      )
    }
  }
}
</script>
<style scoped>
  .login-card {
    height: 500px;
    width: 500px;
    border: solid 1px;
    border-radius: 5em;
  }
</style>
