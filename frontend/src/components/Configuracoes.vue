<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="theme" class="card-header">
        Configurações
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="close"
            @click="hide"
          />
          <q-tooltip>
            Fechar
          </q-tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-px-md">
          <span class="configuration-title">Ao finalizar venda:</span>
          <div class="row">
            <label class="label-center">Preencher informações adicionais?</label>
            <q-toggle v-model="informacoesAdicionais"
              @input="setPreencherInformacoesAdicionais"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import themeUtil from './util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  data () {
    return {
      informacoesAdicionais: false
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    setPreencherInformacoesAdicionais (val) {
      this.informacoesAdicionais = val
      this.$store.dispatch('configPdv/informacoesAdicionaisVenda', val)
    },
    onDialogHide () {
      this.$emit('hide')
    }
  },
  mounted () {
    this.informacoesAdicionais = this.$store.getters['configPdv/informacoesAdicionaisVendaGetter']
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
<style lang="scss">
.label-center {
  margin-top: auto;
  margin-bottom: auto;
}
.configuration-title {
  font-weight: 700;
  font-size: 24px;
}
</style>
