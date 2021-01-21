<template>
  <q-page class="flex flex-center">
    <q-card class="login-cadastro">
        <q-card-section>
          <div class="text-h6">Cadastro</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input :color='themeInput' outlined v-model="nomeEmpresa" label="Nome da Empresa" />
          <q-input :color='themeInput' outlined v-model="usuario" class="q-mt-md" label="Usuário" />
          <q-input :color='themeInput' outlined v-model="senha" class="q-mt-md" label="Senha" :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                :style="themeText"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input :color='themeInput' outlined v-model="email" class="q-mt-md" label="Email" />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn style="width: 40%;" outline :class="themeInverse" label="Limpar" @click="limparCampos()" />
          <q-btn :class="theme" class="text-white" style="width: 40%;" label="Salvar" :loading="loading" @click="criarUsuario()" />
        </q-card-actions>
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
          if (data && !data.hasError) {
            this.$q.notify({
              type: 'positive',
              message: 'Usuário cadastrado com sucesso!',
              timeout: 2000
            })
            this.$router.push('/login')
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
          this.$q.notify({
            type: 'negative',
            message: err,
            timeout: 2000
          })
          this.loading = false
        }
      )
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
    themeInverse () {
      return themeUtil.getThemeInverse(this.$store)
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
