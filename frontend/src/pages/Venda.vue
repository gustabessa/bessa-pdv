<template>
  <q-page class="flex flex-center">
    <q-card class="venda-card q-mt-md q-mb-md">
      <q-card-section class="card-header">
        Venda
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          outlined
          label="Cliente"
          v-model="cliente"
          class="q-mb-md"
          dense />
        <q-input
          outlined
          v-model="model"
          debounce="500"
          @input="filterFn"
          @keyup.enter="filterFn"
          label="Produto"
          hint="Busque pelo nome do produto"
          style="padding-bottom: 32px"
          dense
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="search"
              style="color: purple;"
            />
          </template>
        </q-input>
        <div v-if="produtoSelecionado" class="row">
          <q-separator class="q-mb-md" />
          <div class="col-sm-5 q-pr-sm">
            <q-input
              outlined
              label="Nome"
              v-model="nome"
              class="q-mb-md" />
          </div>
          <div class="col-sm-3 q-pl-sm q-pr-sm">
            <q-input
              outlined
              label="Qtde."
              ref="quantidadeRef"
              v-model.number="quantidade"
              type="number"
              class="q-mb-md" />
          </div>
          <div class="col-sm-3 q-pl-sm q-pr-sm">
            <q-input
              outlined
              label="Preço (R$)"
              v-model="preco"
              class="q-mb-md"
              mask="#,##"
              fill-mask="0"
              reverse-fill-mask />
          </div>
          <div class="col-sm-1">
            <q-btn
            icon="add"
            @click="adicionarItem"
            class="q-mb-md btn-purple"
            style="width: 100%; height: 56px;"
          />
          </div>
          <q-separator class="q-mb-md" />
        </div>
        <template v-if="table">
          <div>
            <q-table
              style="height: 300px;"
              class="my-sticky-header-table produtosTable"
              :data="data"
              :columns="columns"
              row-key="name"
              bordered
              separator="cell"
              hide-bottom
              @row-click="escolherProduto"
              :rows-per-page-options="rowsPerPageOptions"
            />
          </div>
        </template>
        <template v-if="!table">
          <div>
            <q-table
              ref="myTable"
              tabindex="0"
              :class="focusClass"
              style="height: 300px;"
              class="my-sticky-header-table"
              :data="itensVenda"
              :columns="columnsVenda"
              row-key="item"
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
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props"
                  @click="escolherItem(props.row, props)">
                  <q-td key="cod" class="cursor-pointer" :props="props">
                    {{ props.row.fk_itemvenda_produto }}
                  </q-td>
                  <q-td key="nome" :props="props">
                    {{ props.row.nome }}
                    <q-popup-edit v-model="props.row.nome">
                      <q-input type="text" v-model="props.row.nome" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="preco" :props="props">
                    {{ formataDinheiro(props.row.preco) }}
                    <q-popup-edit v-model="props.row.preco">
                      <q-input v-model="props.row.preco" debounce="1000" @input="atualizaPrecoTotal(props.row, props.row.quantidade, props.row.preco)" dense autofocus mask="#,##"
                        fill-mask="0"
                        reverse-fill-mask />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="quantidade" :props="props">
                    {{ props.row.quantidade }}
                    <q-popup-edit v-model="props.row.quantidade">
                      <q-input type="number" v-model.number="props.row.quantidade" debounce="1000" @input="atualizaPrecoTotal(props.row, props.row.quantidade, props.row.preco, )" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="precoTotal" :props="props">
                    {{ formataDinheiro(props.row.quantidade * Number(props.row.preco.replace(',', '.'))) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
        <q-btn style="width: 175px;" class="btn-purple float-right q-mt-sm q-ml-sm q-mb-sm" label="Finalizar Venda" :loading="loading" @click="finalizarVenda" />
        <div class="float-right text-h5 text-purple q-ma-sm">
          Subtotal: {{ formataDinheiro(getSubtotal()) }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'
import dialog from '../components/util/DialogUtil'
export default {
  name: 'Venda',
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
          name: 'nome',
          align: 'left',
          label: 'Produto',
          field: row => row.nome

        },
        {
          name: 'preco',
          align: 'left',
          label: 'Preço (R$)',
          field: row => row.preco,
          format: val => `R$ ${Number.parseFloat(val).toFixed(2)}`.replace(',', '.').replace('.', ',')
        }
      ],
      columnsVenda: [
        {
          name: 'cod',
          label: 'Cod.',
          align: 'left'
        },
        {
          name: 'nome',
          align: 'left',
          label: 'Produto'
        },
        {
          name: 'preco',
          align: 'left',
          label: 'Preço Un. (R$)'
        },
        {
          name: 'quantidade',
          align: 'left',
          label: 'Qtde.'
        },
        {
          name: 'precoTotal',
          align: 'left',
          label: 'Total (R$)'
        }
      ],
      data: [],
      itensVenda: [],
      selected: [],
      loading: false,
      model: null,
      id: null,
      nome: '',
      preco: null,
      quantidade: null,
      cliente: null,
      produtoSelecionado: null,
      table: false,
      focused: false
    }
  },
  methods: {
    escolherItem (row, props) {
      this.selected = [row]
    },
    formataDinheiro (val) {
      return `R$ ${Number.parseFloat(val).toFixed(2)}`.replace(',', '.').replace('.', ',')
    },
    filterFn () {
      httpUtil.doGet('/api/produto',
        data => {
          if (data && data.length > 0) {
            this.table = true
            this.data = data
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Nenhum resultado para a busca.',
              timeout: 2000
            })
            this.table = false
          }
        },
        err => {
          console.error(err)
          this.data = []
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao buscar',
            timeout: 2000
          })
          this.table = false
        }, { nome: this.model })
    },
    getSubtotal () {
      let result = 0
      if (this.itensVenda) {
        this.itensVenda.forEach(item => {
          result += Number.parseFloat(item.precoTotal)
        })
      }
      return result
    },
    finalizarVenda () {
      this.loading = true
      const venda = {
        cliente: this.cliente,
        subtotal: this.getSubtotal(),
        itensVenda: this.itensVenda
      }
      const callback = {
        onSuccess: data => {
          this.$q.notify({
            type: 'positive',
            message: 'Venda finalizada com sucesso!',
            timeout: 2000
          })
          this.loading = false
          window.open(data)
          this.itensVenda = []
          this.cliente = null
        },
        onError: err => {
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao finalizar venda.',
            timeout: 2000
          })
          this.loading = false
        }
      }
      dialog.confirm('Deseja finalizar a venda?')
        .onOk(() => httpUtil.doPost('/api/venda', venda, callback.onSuccess, callback.onError))
        .onCancel(() => { this.loading = false })
    },
    escolherProduto (evt, row, index) {
      this.model = null
      this.table = false
      this.id = row.id
      this.nome = row.nome
      this.preco = row.preco
      this.produtoSelecionado = true
      setTimeout(() => {
        this.$refs.quantidadeRef.focus()
      }, 200)
    },
    adicionarItem () {
      this.itensVenda.push({
        nome: this.nome,
        fk_itemvenda_produto: this.id,
        preco: this.preco,
        quantidade: this.quantidade,
        precoTotal: this.getPrecoTotal()
      })
      let item = 1
      this.itensVenda.forEach(itemVenda => {
        itemVenda.item = item
        item++
      })
      this.produtoSelecionado = false
      this.id = null
      this.nome = null
      this.preco = null
      this.quantidade = null
    },
    atualizaPrecoTotal (row, qtde, preco) {
      row.precoTotal = Number.parseFloat(qtde) * Number.parseFloat(preco)
    },
    getPrecoTotal () {
      this.quantidade = Number.parseFloat(this.quantidade)
      this.preco = Number.parseFloat(this.preco)
      return this.quantidade * this.preco
    },
    printModel () {
      console.log(this.model)
    },
    onFocus () {
      this.focused = true
    },

    onBlur () {
      this.focused = false
      this.selected = []
    },

    onKey (evt) {
      if (
        this.focused !== true ||
        [33, 34, 38, 40, 46].indexOf(evt.keyCode) === -1 ||
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
        case 46: // Delete
          this.removerSelecionado()
          break
      }
      this.selected = [computedRows[index]]
    },
    removerSelecionado () {
      this.itensVenda = this.itensVenda.filter(itemVenda => itemVenda.item !== this.selected[0].item)
      this.selected = []
      let item = 1
      this.itensVenda.forEach(itemVenda => {
        itemVenda.item = item
        item++
      })
    }
  },
  computed: {
    rowsPerPageOptions () {
      return [100]
    },
    focusClass () {
      if (this.focused) {
        return 'my-focused-table'
      } else return ''
    }
  }
}
</script>
<style>

  .my-sticky-header-table {
    height: auto;
    max-height: 350px;
  }

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }

  .card-header {
    padding: 5px 0 5px 15px;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
    background-color: purple;
    color: white;
  }

  .produtosTable div thead tr th {
    background-color: blue !important;
  }

  /* this is when the loading indicator appears */
  .q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
</style>
