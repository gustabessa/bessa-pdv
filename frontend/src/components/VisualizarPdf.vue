<template>
  <q-dialog ref="dialog" full-width full-height @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="theme" class="card-header">
        Visualizar Impressão
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
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="refresh"
            @click="reopen"
          />
          <q-tooltip>
            Atualizar
          </q-tooltip>
        </div>
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="tab"
            @click="windowOpen"
          />
          <q-tooltip>
            Abrir em uma nova aba
          </q-tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section style="height: 89%;">
          <q-pdfviewer
            content-style="height: 100%;"
            inner-content-style="height: 100%;"
            v-model="visible"
            :src="url"
            type="html5"
          />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
import VisualizarPdf from '../components/VisualizarPdf'

export default {
  name: 'VisualizarPdf',
  data () {
    return {
      visible: true
    }
  },
  props: {
    url: null
  },
  methods: {
    reopen () {
      this.$q.dialog({
        component: VisualizarPdf,
        parent: this,
        url: this.url
      })
      this.hide()
    },
    windowOpen () {
      window.open(this.url)
    },
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
