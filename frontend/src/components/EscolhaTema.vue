<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="theme" class="card-header">
        Escolha o Tema
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
        <div class="q-pa-md">
          <div class="row">
            <q-toggle v-model="valueDefault"
              @input="escolherCor('default')"
            />
            <label class="label-center">Roxo</label>
          </div>
          <div class="row">
            <q-toggle
              v-model="theme2"
              color="green"
              @input="escolherCor('theme2')"
            />
            <label class="label-center">Verde</label>
          </div>
          <div class="row">
            <q-toggle
              v-model="theme3"
              color="black"
              @input="escolherCor('theme3')"
            />
            <label class="label-center">Preto</label>
          </div>
          <div class="row">
            <q-toggle
              v-model="theme4"
              color="orange"
              @input="escolherCor('theme4')"
            />
            <label class="label-center">Laranja</label>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { colors } from 'quasar'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  name: 'EscolhaTema',
  data () {
    return {
      valueDefault: false,
      theme2: false,
      theme4: false,
      theme3: false
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      this.hide()
    },

    onCancelClick () {
      this.hide()
    },

    escolherCor (cor) {
      colors.setBrand('primary', scss[cor])
      switch (cor) {
        case 'theme2':
          this.valueDefault = false
          this.theme2 = true
          this.theme4 = false
          this.theme3 = false
          this.$store.dispatch('themes/Theme2')
          break
        case 'theme3':
          this.valueDefault = false
          this.theme2 = false
          this.theme4 = false
          this.theme3 = true
          this.$store.dispatch('themes/Theme3')
          break
        case 'theme4':
          this.valueDefault = false
          this.theme2 = false
          this.theme4 = true
          this.theme3 = false
          this.$store.dispatch('themes/Theme4')
          break
        default:
          this.valueDefault = true
          this.theme2 = false
          this.theme4 = false
          this.theme3 = false
          this.$store.dispatch('themes/Default')
      }
    }
  },
  mounted () {
    const cor = this.$store.state.themes.name
    switch (cor) {
      case 'theme2':
        this.theme2 = true
        break
      case 'theme3':
        this.theme3 = true
        break
      case 'theme4':
        this.theme4 = true
        break
      default:
        this.valueDefault = true
        break
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
<style lang="scss">
.label-center {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
