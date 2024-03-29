<template >
  <q-dialog ref="dialog" full-width @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="theme" class="card-header">
        Detalhamento da Venda
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
        <template>
          <div class="row q-mb-md">
            <div class="col-3 offset-3 q-pa-sm">
              <q-btn :class="theme" style="width: 100%;" icon="print" class="text-white q-ml-md" label="Imprimir" :loading="loading" @click="generateReport" />
            </div>
            <div class="col-3 q-pa-sm">
              <q-btn :class="theme" style="width: 100%;" icon="input" class="text-white q-ml-md" label="Importar" :loading="loading" @click="importarVenda" />
            </div>
          </div>
          <div>
            <q-table
              class="my-sticky-header-table"
              :data="itensVenda"
              :columns="columnsItem"
              row-key="name"
              bordered
              separator="cell"
              hide-bottom
              :rows-per-page-options="rowsPerPageOptions"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th :class="theme" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
import httpUtil from '../components/util/HttpUtil'
import VisualizarPdf from '../components/VisualizarPdf'

export default {
  name: 'DetalhamentoVenda',
  data () {
    return {
      loading: false,
      primary: '#000000',
      itensVenda: [],
      columnsItem: [
        {
          name: 'cod',
          required: true,
          label: 'Cod.',
          align: 'left',
          field: row => row.fk_itemvenda_produto
        },
        {
          name: 'nome',
          align: 'left',
          label: 'Produto',
          field: row => row.nome
        },
        {
          name: 'preco',
          align: 'left',
          label: 'Preço Un. (R$)',
          field: row => row.preco,
          format: val => this.formataDinheiro(val)
        },
        {
          name: 'quantidade',
          align: 'left',
          label: 'Quantidade',
          field: row => row.quantidade
        },
        {
          name: 'precoTotal',
          align: 'left',
          label: 'Preço Total (R$)',
          field: row => row.precoTotal,
          format: val => this.formataDinheiro(val)
        }
      ]
    }
  },
  props: {
    venda: null
  },
  methods: {
    generateReport () {
      this.$q.loading.show({
        spinnerColor: this.primary
      })
      httpUtil.doGet('/api/venda/report/history',
        data => {
          this.$q.loading.hide()
          if (data && !data.hasError) {
            this.$q.dialog({
              component: VisualizarPdf,
              parent: this,
              url: data
            })
            this.hide()
          } else {
            console.error(data.techError)
            this.$q.notify({
              type: 'negative',
              message: data.messageError,
              timeout: 2000
            })
          }
        },
        err => {
          this.$q.loading.hide()
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao gerar relatório.',
            timeout: 2000
          })
        }, { id: this.venda.id })
    },
    importarVenda () {
      const callback = {
        onSuccess: data => {
          if (data && !data.hasError) {
            this.$q.notify({
              type: 'positive',
              message: 'Venda importada com sucesso!',
              timeout: 2000
            })
            this.cliente = data.cliente
            this.itensVenda = data.itensVenda.map(
              item => {
                return {
                  item: item.item,
                  fk_itemvenda_produto: item.fk_itemvenda_produto,
                  nome: item.nome,
                  preco: item.preco,
                  quantidade: item.quantidade,
                  precoTotal: item.precoTotal
                }
              }
            )
            this.$store.dispatch('bessaPdv/itensVenda', this.itensVenda)
            this.$store.dispatch('bessaPdv/cliente', this.cliente)
          } else if (data.hasError) {
            console.error(data.techError)
            this.$q.notify({
              type: 'negative',
              message: data.messageError,
              timeout: 2000
            })
          }
          this.loading = false
          this.$router.push('venda')
        },
        onError: err => {
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao buscar venda.',
            timeout: 2000
          })
          this.loading = false
        }
      }
      httpUtil.doGet('/api/venda/' + this.venda.id, callback.onSuccess, callback.onError)
    },
    formataDinheiro (val) {
      return `R$ ${Number(val).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
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
    rowsPerPageOptions () {
      const rowsPerPage = this.itensVenda?.length ? this.itensVenda.length : 0
      return [rowsPerPage]
    },
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
  },
  mounted () {
    this.itensVenda = this.venda.itensVenda
    const cor = this.$store.state.themes.name
    this.primary = scss[cor]
  }
}
</script>
<style lang="scss">
.label-center {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
