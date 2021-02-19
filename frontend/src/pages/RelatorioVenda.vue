<template>
  <q-page class="flex flex-center">
    <q-card class="produtos-card q-mt-md q-mb-md">
      <q-card-section :class="theme" class="card-header">
        Relatório de Vendas
      </q-card-section>
      <q-separator />
      <q-card-section>
        Filtros
        <div class="row">
          <div class="col-xs-12 col-sm-3 q-pr-sm">
            <q-input
              @keyup.enter="filterFn"
              dense
              :color='themeInput'
              outlined
              label="Preço Inicial (R$)"
              v-model="precoInicial"
              class="q-mb-md"
              mask="#,##"
              fill-mask="0"
              reverse-fill-mask />
          </div>
          <div class="col-xs-12 col-sm-3 q-pr-sm">
            <q-input
              @keyup.enter="filterFn"
              dense
              :color='themeInput'
              outlined
              label="Preço Final (R$)"
              v-model="precoFinal"
              class="q-mb-md"
              mask="#,##"
              fill-mask="0"
              reverse-fill-mask />
          </div>
          <div class="col-xs-12 col-sm-3 q-pr-sm">
            <q-input
              @keyup.enter="filterFn"
              dense
              :color='themeInput'
              outlined
              label="Data Inicial"
              v-model="dataInicial"
              class="q-mb-md"
              type="date" />
          </div>
          <div class="col-xs-12 col-sm-3">
            <q-input
              @keyup.enter="filterFn"
              dense
              :color='themeInput'
              outlined
              label="Data Final"
              v-model="dataFinal"
              class="q-mb-md"
              type="date" />
          </div>
        </div>
        <div class="text-center">
          <q-btn :class="theme" style="width: 30%;" class="text-white q-mr-md" label="Filtrar" :loading="loading" @click="filterFn" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <template>
          <div>
            Vendas
            <q-table
              class="my-sticky-header-table"
              :data="data"
              ref="myTable"
              tabindex="0"
              :class="focusClass"
              :columns="columns"
              row-key="id"
              bordered
              separator="cell"
              hide-bottom
              selection="single"
              :selected.sync="selected"
              @focusin.native="onFocus"
              @focusout.native="onBlur"
              @keydown.native="onKey"
              :rows-per-page-options="rowsPerPageOptions"
            >
             <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th :class="theme" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr class="cursor-pointer" :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props"
                    @click="escolherVenda(props.row, props)">
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import DetalhamentoVenda from '../components/DetalhamentoVenda'
import httpUtil from '../components/util/HttpUtil'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  name: 'RelatorioVendas',
  data () {
    return {
      columns: [
        {
          name: 'cod',
          required: true,
          label: 'Cod.',
          align: 'left',
          field: row => row.id
        },
        {
          name: 'cliente',
          align: 'left',
          label: 'Cliente',
          field: row => this.getCliente(row)
        },
        {
          name: 'subtotal',
          align: 'left',
          label: 'Subtotal (R$)',
          field: row => row.subtotal,
          format: val => this.formataDinheiro(val)
        },
        {
          name: 'frete',
          align: 'left',
          label: 'Frete (R$)',
          field: row => row.frete,
          format: val => this.formataDinheiro(val)
        },
        {
          name: 'desconto',
          align: 'left',
          label: 'Desconto (R$)',
          field: row => row.desconto,
          format: val => this.formataDinheiro(val)
        },
        {
          name: 'total',
          align: 'left',
          label: 'Total (R$)',
          field: row => row.total,
          format: val => this.formataDinheiro(val)
        },
        {
          name: 'data',
          align: 'left',
          label: 'Data da Venda',
          field: row => row.createdAt,
          format: val => {
            const data = new Date(val)
            return data.toLocaleString()
          }
        }
      ],
      primary: '#000000',
      focused: false,
      itensVenda: [],
      selected: [],
      data: [],
      loading: false,
      model: null,
      id: null,
      nome: '',
      preco: null,
      precoInicial: null,
      precoFinal: null,
      dataInicial: new Date().toISOString().substring(0, 7) + '-01',
      dataFinal: new Date().toISOString().substring(0, 10),
      table: false
    }
  },
  methods: {
    getCliente (row) {
      if (row.cliente && row.cliente.trim() !== '') {
        return row.cliente
      } return 'Consumidor'
    },
    formataDinheiro (val) {
      return `R$ ${Number(val).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    },
    filterFn () {
      this.$q.loading.show({
        spinnerColor: this.primary
      })
      const filters = {
        precoFinal: this.precoFinal != null ? Number(this.precoFinal.replace(',', '.')) : null,
        precoInicial: this.precoInicial != null ? Number(this.precoInicial.replace(',', '.')) : null,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
      httpUtil.doGet('/api/venda',
        data => {
          this.$q.loading.hide()
          if (data && !data.hasError) {
            if (data.length > 0) {
              this.data = data
            } else {
              this.$q.notify({
                type: 'negative',
                message: 'Nenhum resultado para a busca.',
                timeout: 2000
              })
              this.data = []
            }
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
          this.data = []
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao buscar.',
            timeout: 2000
          })
        }, filters)
    },
    escolherVenda (row, props) {
      this.itensVenda = row.itensVenda
      this.selected = [row]
      this.$q.dialog({
        component: DetalhamentoVenda,
        parent: this,
        venda: row
      })
      // this.id = row.id
      // this.nome = row.nome
      // this.preco = row.preco
    },
    printModel (model) {
      console.log(model)
    },
    onFocus () {
      this.focused = true
    },

    onBlur () {
      this.focused = false
    },

    onKey (evt) {
      if (
        this.focused !== true ||
        [33, 34, 38, 40].indexOf(evt.keyCode) === -1 ||
        this.$refs.myTable === undefined
      ) {
        return
      }

      evt.preventDefault()

      const computedRows = this.$refs.myTable.computedRows

      if (computedRows.length === 0) {
        return
      }

      const currentIndex = this.selected.length > 0 ? computedRows.indexOf(this.selected[0]) : -1
      const lastIndex = computedRows.length - 1
      let index = currentIndex

      switch (evt.keyCode) {
        case 38: // ArrowUp
          if (currentIndex > 0) {
            index = currentIndex - 1
          }
          break
        case 40: // ArrowDown
          if (currentIndex < lastIndex) {
            index = currentIndex + 1
          }
          break
      }
      this.selected = [computedRows[index]]
      this.itensVenda = this.selected[0].itensVenda
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
    rowsPerPageOptions () {
      return [this.data.length]
    },
    focusClass () {
      if (this.focused) {
        return 'my-focused-table'
      } else return ''
    }
  },
  mounted () {
    this.filterFn()
    const cor = this.$store.state.themes.name
    this.primary = scss[cor]
  }
}
</script>
<style lang="scss">

  .my-sticky-header-table {
    height: auto;
    max-height: 250px;
  }

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
    background-color: $primary;
    color: $text-color;
  }

  /* this is when the loading indicator appears */
  .q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

</style>
