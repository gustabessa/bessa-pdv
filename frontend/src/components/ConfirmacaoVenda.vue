<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="theme" class="card-header">
        Finalizar Venda
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
        <div class="row">
          <div class="col-12">
            <q-input
              dense
              outlined
              :color='themeInput'
              label="Subtotal (R$)"
              v-model="subtotal"
              class="q-mb-md q-pr-sm"
              mask="#,##"
              fill-mask="0"
              readonly
              reverse-fill-mask />
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <q-input
              dense
              :color='themeInput'
              ref="refNumFrete"
              type="number"
              @input="onInput"
              @click="select"
              outlined
              label="Qtde Fretes"
              v-model="valores.numFrete"
              class="q-mb-md q-pr-sm" />
          </div>
          <div class="col-8">
            <q-input
              dense
              :color='themeInput'
              @input="calcularValores"
              outlined
              label="Valor Frete (R$)"
              v-model="valores.vlrFrete"
              class="q-mb-md q-pr-sm"
              mask="#,##"
              fill-mask="0"
              reverse-fill-mask />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              dense
              :color='themeInput'
              ref="refVlrDesconto"
              @input="calcularValores"
              outlined
              label="Desconto (R$)"
              v-model="valores.vlrDesconto"
              class="q-mb-md q-pr-sm"
              mask="#,##"
              fill-mask="0"
              reverse-fill-mask />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              dense
              :color='themeInput'
              outlined
              label="Total (R$)"
              v-model="valores.vlrTotal"
              class="q-mb-md q-pr-sm"
              mask="#,##"
              fill-mask="0"
              readonly
              reverse-fill-mask />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center" class="text-primary">
        <q-btn :class="themeInverse" style="width: 40%;" outline label="Cancelar" @click="onCancelClick" />
        <q-btn style="width: 40%;" :class="theme" class="text-white" label="Finalizar" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  name: 'ConfirmacaoVenda',
  data () {
    return {
      valores: {
        vlrFrete: '0',
        numFrete: 0,
        vlrDesconto: '0',
        vlrTotal: 0
      }
    }
  },
  props: {
    subtotal: null
  },

  methods: {
    onInput (val) {
      this.valores.numFrete = val
      if (val && val < 0) {
        this.valores.numFrete = 0
      } else {
        this.calcularValores()
      }
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$store.dispatch('bessaPdv/valoresVenda', this.valores)
      this.$emit('hide')
    },

    onOKClick () {
      const valores = this.calcularValores()
      this.$emit('ok', valores)
      this.hide()
    },

    onCancelClick () {
      this.hide()
    },

    calcularValores () {
      let vlrCalculado = {}
      vlrCalculado.vlrFrete = Number(this.valores.numFrete * Number(this.valores.vlrFrete.replace(',', '.')).toFixed(2))
      vlrCalculado.vlrDesconto = Number(Number(this.valores.vlrDesconto.replace(',', '.')).toFixed(2))
      vlrCalculado.vlrTotal = 1 * this.subtotal + vlrCalculado.vlrFrete - vlrCalculado.vlrDesconto
      vlrCalculado.qtdeFrete = Number(this.valores.numFrete)
      this.valores.vlrTotal = vlrCalculado.vlrTotal.toFixed(2)
      if (vlrCalculado.vlrTotal < 0) {
        this.$q.notify({
          type: 'negative',
          message: 'A venda não pode ter valor negativo.',
          timeout: 2000
        })
        this.valores.vlrDesconto = '0'
        this.$refs.refVlrDesconto.innerValue = '0,00'
        vlrCalculado = this.calcularValores()
      }
      return vlrCalculado
    },

    select () {
      this.$refs.refNumFrete.select()
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
  },
  mounted () {
    this.valores.vlrDesconto = this.$store.getters['bessaPdv/descontoGetter']
    this.valores.vlrFrete = this.$store.getters['bessaPdv/freteGetter']
    this.valores.numFrete = this.$store.getters['bessaPdv/qtdeFreteGetter']
    this.calcularValores()
  }
}
</script>
