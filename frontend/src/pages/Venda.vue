<template>
  <q-page class="flex flex-center">
    <q-card class="venda-card q-mt-md q-mb-md">
      <q-card-section :class="theme" class="card-header">
        Venda
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="input"
            @click="importarVenda"
          />
          <q-tooltip>
            Importar venda
          </q-tooltip>
        </div>
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="warning_amber"
            @click="limparVenda"
          />
          <q-tooltip>
            Limpar venda
          </q-tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          outlined
          label="Cliente"
          v-model="cliente"
          class="q-mb-md"
          :color='themeInput'
          @blur="salvarCliente"
          @keyup.enter="() => focarInput('refProduto')"
          dense />
        <q-input
          outlined
          ref="refProduto"
          v-model="model"
          @keyup.enter="filterFn"
          label="Produto"
          :color='themeInput'
          hint="Busque pelo nome do produto"
          style="padding-bottom: 32px"
          dense
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="search"
              :style="themeText"
            />
          </template>
        </q-input>
        <div v-if="produtoSelecionado" class="row">
          <q-separator class="q-mb-md" />
          <div class="col-xs-12 col-sm-5 q-pr-sm">
            <q-input
              dense
              outlined
              label="Nome"
              :color='themeInput'
              v-model="nome"
              @keyup.enter="adicionarItem"
              class="q-mb-md" />
          </div>
          <div class="col-xs-5 col-sm-3 q-pl-sm q-pr-sm">
            <q-input
              dense
              outlined
              :color='themeInput'
              label="Qtde."
              ref="quantidadeRef"
              @keyup.enter="adicionarItem"
              v-model.number="quantidade"
              type="number"
              class="q-mb-md" />
          </div>
          <div class="col-xs-6 col-sm-3 q-pl-sm q-pr-sm">
            <q-input
              dense
              outlined
              :color='themeInput'
              label="Preço (R$)"
              v-model="preco"
              class="q-mb-md"
              mask="#,##"
              fill-mask="0"
              @keyup.enter="adicionarItem"
              reverse-fill-mask />
          </div>
          <div class="col-1">
            <q-btn
            dense
            icon="add"
            @click="adicionarItem"
            :class="theme"
            class="q-mb-md btn-purple"
            style="width: 100%; height: 39px;"
          />
          </div>
          <q-separator class="q-mb-md" />
        </div>
        <template v-if="table">
          <div>
            <!-- Table header customizado fora da table para não interferir no table.scrollTo() -->
            <!-- Cenários: Sticky top header tampa 1 linha -->
            <!-- Header normal some no scroll -->
            <div class="custom-header-wrapper">
              <div style="width: 100%; display: flex;">
                <div class="custom-th custom-border-right" style="width: 15%;"><span>Cod.</span></div>
                <div class="custom-th custom-border-right" style="width: 55%;"><span>Produto</span></div>
                <div class="custom-th" style="width: 30%;"><span>Preço (R$)</span></div>
              </div>
            </div>
            <q-table
              :pagination.sync="pagination"
              id="tableProduto"
              :class="focusClassProduto"
              tabindex="0"
              ref="myTableProduto"
              style="height: 300px;"
              class="my-sticky-header-table produtosTable"
              :data="data"
              :columns="columns"
              row-key="id"
              bordered
              separator="cell"
              hide-bottom
              selection="single"
              virtual-scroll
              :selected.sync="selectedProduto"
              @focusin.native="onFocusProduto"
              @focusout.native="onBlurProduto"
              @keydown.native="onKeyProduto"
              :rows-per-page-options="[0]"
            >
              <template v-slot:header="props">
                <q-tr :props="props" style="display: none;">
                  <q-th :class="theme" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props"
                @click="escolherItemProduto(props.row)">
                  <q-td key="cod" :props="props" style="width: 15%;">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="nome" :props="props" style="width: 55%;">
                    {{ props.row.nome }}
                  </q-td>
                  <q-td key="preco" :props="props" style="width: 30%;">
                    {{ formataDinheiro(props.row.preco) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
        <template v-if="!table">
          <div>
            <q-table
              :pagination.sync="pagination"
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
              :rows-per-page-options="[0]"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th :class="theme" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props"
                  @click="escolherItem(props.row)">
                  <q-td key="opc" class="cursor-pointer" :props="props">
                    <q-btn
                      flat
                      dense
                      round
                      class="q-mr-md text-red-10"
                      icon="delete_outline"
                      @click="removerSelecionado(props.row)"
                    />
                  </q-td>
                  <q-td key="cod" class="cursor-pointer" :props="props">
                    {{ props.row.fk_itemvenda_produto }}
                  </q-td>
                  <q-td key="nome" class="cursor-pointer" :props="props">
                    {{ props.row.nome }}
                    <q-popup-edit @hide="atualizarStore" auto-save v-model="props.row.nome">
                      <q-input type="text" v-model="props.row.nome" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="preco" class="cursor-pointer" :props="props">
                    {{ formataDinheiro(props.row.preco) }}
                    <q-popup-edit @hide="atualizarStore" auto-save v-model="props.row.preco">
                      <q-input ref="refPreco" v-model="props.row.preco" debounce="1000" @input="atualizaPrecoTotal(props.row, props.row.quantidade, props.row.preco)" dense autofocus mask="#,##"
                        fill-mask="0"
                        reverse-fill-mask />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="quantidade" class="cursor-pointer" @click="selectQuantidade" :props="props">
                    {{ Number(props.row.quantidade).toFixed(2) }}
                    <q-popup-edit @hide="atualizarStore" auto-save v-model="props.row.quantidade">
                      <q-input ref="refQuantidade" type="number" v-model.number="props.row.quantidade" debounce="1000" @input="atualizaPrecoTotal(props.row, props.row.quantidade, props.row.preco)" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="precoTotal" :props="props">
                    {{ formataDinheiro(props.row.precoTotal) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
        <q-btn style="width: 175px;" :class="theme" class="btn-purple float-right q-mt-sm q-ml-sm q-mb-sm" label="Finalizar Venda" :loading="loading" @click="finalizarVenda" />
        <div :style="themeText" class="float-right text-h5 q-ma-sm">
          Subtotal: {{ formataDinheiro(getSubtotal()) }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'
import dialog from '../components/util/DialogUtil'
import ConfirmacaoVenda from '../components/ConfirmacaoVenda'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
import VisualizarPdf from '../components/VisualizarPdf'

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
          name: 'opc',
          label: '...',
          align: 'left'
        },
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
      primary: '#000000',
      data: [],
      itensVenda: [],
      itensVendaTable: [],
      selected: [],
      selectedProduto: [],
      loading: false,
      model: null,
      id: null,
      nome: '',
      preco: null,
      quantidade: null,
      cliente: null,
      produtoSelecionado: null,
      table: false,
      focused: false,
      focusedProduto: false,
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  methods: {
    selectQuantidade () {
      setTimeout(() => {
        this.$refs.refQuantidade.select()
      }, 200)
    },
    importarVenda () {
      this.loading = true
      const callback = {
        onSuccess: data => {
          this.$q.loading.hide()
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
        },
        onError: err => {
          this.$q.loading.hide()
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao buscar venda.',
            timeout: 2000
          })
          this.loading = false
        }
      }
      dialog.prompt('Importar venda:')
        .onOk(data => {
          this.$q.loading.show({
            spinnerColor: this.primary
          })
          httpUtil.doGet('/api/venda/' + data, callback.onSuccess, callback.onError)
        })
        .onCancel(() => { this.loading = false })
    },
    escolherItem (row) {
      this.selected = [row]
    },
    escolherItemProduto (row) {
      if (this.selectedProduto && this.selectedProduto.includes(row)) {
        this.selectedProduto = []
        this.escolherProduto(row)
        return
      }
      this.selectedProduto = [row]
    },
    formataDinheiro (val) {
      return `R$ ${Number(val).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    },
    filterFn () {
      httpUtil.doGet('/api/produto',
        data => {
          if (data && !data.hasError) {
            if (data.length > 0) {
              this.table = true
              this.data = data
              setTimeout(() => {
                this.focusedProduto = true
                this.selectedProduto = []
                this.escolherItemProduto(data[0])
                document.getElementById('tableProduto').focus()
                this.$refs.myTableProduto.scrollTo(0)
              }, 100)
            } else {
              this.$q.notify({
                type: 'negative',
                message: 'Nenhum resultado para a busca.',
                timeout: 2000
              })
              this.table = false
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
    limparVenda () {
      dialog.confirm('Tem certeza que deseja limpar a venda?').onOk(() => {
        this.$store.dispatch('bessaPdv/limparVenda')
        this.$q.notify({
          type: 'positive',
          message: 'Venda limpa com sucesso!',
          timeout: 2000
        })
        this.itensVenda = []
        this.cliente = null
      })
    },
    atualizarStore () {
      this.itensVendaStore = this.itensVenda.map(x => {
        return {
          item: x.item,
          fk_itemvenda_produto: x.fk_itemvenda_produto,
          nome: x.nome,
          preco: x.preco,
          precoTotal: x.precoTotal,
          quantidade: x.quantidade
        }
      })
      this.$store.dispatch('bessaPdv/itensVenda', this.itensVendaStore)
    },
    finalizarVenda () {
      this.loading = true
      const callback = {
        onSuccess: data => {
          this.$q.loading.hide()
          if (data && !data.hasError) {
            this.$q.notify({
              type: 'positive',
              message: 'Venda finalizada com sucesso!',
              timeout: 2000
            })
            this.$store.dispatch('bessaPdv/limparVenda')
            this.$q.dialog({
              component: VisualizarPdf,
              parent: this,
              url: data
            })
            this.itensVenda = []
            this.cliente = null
          } else {
            console.error(data.techError)
            this.$q.notify({
              type: 'negative',
              message: data.messageError,
              timeout: 2000
            })
          }
          this.loading = false
        },
        onError: err => {
          this.$q.loading.hide()
          console.error(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao finalizar venda.',
            timeout: 2000
          })
          this.loading = false
        }
      }
      const vendaSubtotal = this.getSubtotal()
      if (!this.informacoesAdicionaisVenda) {
        this.salvarVenda({
          vlrTotal: this.getSubtotal(),
          vlrDesconto: 0,
          vlrFrete: 0,
          qtdeFrete: 0
        }, callback)
      } else {
        this.$q.dialog({
          component: ConfirmacaoVenda,
          parent: this,
          subtotal: vendaSubtotal.toFixed(2)
        })
          .onOk(valores => {
            this.salvarVenda(valores, callback)
          })
          .onCancel(() => { this.loading = false })
      }
    },
    salvarVenda (valores, callback) {
      const venda = {
        cliente: this.cliente,
        subtotal: this.getSubtotal(),
        itensVenda: this.itensVenda,
        total: valores.vlrTotal,
        desconto: valores.vlrDesconto,
        frete: valores.vlrFrete,
        qtdeFrete: valores.qtdeFrete
      }
      this.$q.loading.show({
        spinnerColor: this.primary
      })
      httpUtil.doPost('/api/venda', venda, callback.onSuccess, callback.onError)
    },
    escolherProduto (row) {
      this.model = null
      this.table = false
      this.id = row.id
      this.nome = row.nome
      this.preco = row.preco
      this.produtoSelecionado = true
      setTimeout(() => {
        this.focarInput('quantidadeRef')
      }, 200)
    },
    cancelarProdutoSelecionado () {
      this.model = null
      this.table = false
      this.id = null
      this.nome = null
      this.preco = null
      this.produtoSelecionado = false
      this.focarInput('refProduto')
    },
    keyDownHandler (evt) {
      if (evt.keyCode === 27) {
        this.cancelarProdutoSelecionado()
      }
    },
    focarInput (ref) {
      if (this.$refs[ref]) {
        this.$refs[ref].focus()
      }
    },
    salvarCliente () {
      this.$store.dispatch('bessaPdv/cliente', this.cliente)
    },
    adicionarItem () {
      if (this.quantidade > 0) {
        if (typeof this.preco === 'string') {
          this.preco = Number.parseFloat(this.preco.replace(',', '.')).toFixed(2)
        }
        const arrAux = JSON.parse(JSON.stringify([...this.itensVenda]))

        arrAux.push({
          nome: this.nome,
          fk_itemvenda_produto: this.id,
          preco: this.preco,
          quantidade: this.quantidade,
          precoTotal: this.getPrecoTotal()
        })

        let item = 1
        arrAux.forEach(itemVenda => {
          itemVenda.item = item
          item++
        })

        this.itensVenda = JSON.parse(JSON.stringify(arrAux))
        this.$store.dispatch('bessaPdv/itensVenda', arrAux)
        this.produtoSelecionado = false
        this.id = null
        this.nome = null
        this.preco = null
        this.quantidade = null
        this.focarInput('refProduto')
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Insira uma quantidade maior que 0!',
          timeout: 2000
        })
      }
    },
    atualizaPrecoTotal (row, qtde, preco) {
      if (typeof row.preco === 'string') {
        row.preco = Number.parseFloat(row.preco.replace(',', '.')).toFixed(2)
      }
      row.precoTotal = Number.parseFloat(qtde) * Number.parseFloat(row.preco)
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
        this.$refs.myTable === undefined ||
        !this.selected ||
        !this.selected[0]
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
      this.$refs.myTable.scrollTo(index)
    },
    onFocusProduto () {
      this.focusedProduto = true
    },
    onBlurProduto () {
      this.focusedProduto = false
      this.selectedProduto = []
    },
    onKeyProduto (evt) {
      const computedRows = this.$refs.myTableProduto.computedRows
      if (
        this.focusedProduto !== true ||
        [33, 34, 38, 40, 46, 13].indexOf(evt.keyCode) === -1 ||
        this.$refs.myTableProduto === undefined ||
        !computedRows ||
        !computedRows[0]
      ) {
        return
      }
      if (evt.keyCode === 13 && (!this.selectedProduto ||
        !this.selectedProduto[0])) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecione um item primeiro.',
          timeout: 2000
        })
        return
      }
      let index = 0
      if (!this.selectedProduto ||
        !this.selectedProduto[0]) {
        this.selectedProduto = [computedRows[0]]
      } else {
        const currentIndex = this.selectedProduto.length > 0 ? computedRows.indexOf(this.selectedProduto[0]) : -1
        const lastIndex = computedRows.length - 1
        index = currentIndex

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
          case 13:
            this.escolherItemProduto(this.selectedProduto[0])
            break
        }
        this.selectedProduto = [computedRows[index]]
      }
      evt.preventDefault()

      this.$refs.myTableProduto.scrollTo(index)
      // this.$refs.myTableProduto.scrollTo(index / 1.2)
    },
    removerSelecionado (row) {
      dialog.confirm('Deseja excluir o item?')
        .onOk(() => {
          if (row) {
            this.selected = [row]
          }
          let arrAux = JSON.parse(JSON.stringify([...this.itensVenda]))
          arrAux = arrAux.filter(itemVenda => itemVenda.item !== this.selected[0].item)
          this.selected = []

          let item = 1
          arrAux.forEach(itemVenda => {
            itemVenda = {
              ...itemVenda,
              item: item
            }
            item++
          })
          this.itensVenda = JSON.parse(JSON.stringify(arrAux))
          this.$store.dispatch('bessaPdv/itensVenda', arrAux)
          this.$q.notify({
            type: 'positive',
            message: 'Item excluído.',
            timeout: 2000
          })
        })
        .onCancel(() => {
          this.$q.notify({
            type: 'warning',
            message: 'Exclusão do item cancelada.',
            timeout: 2000
          })
        })
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
      return [100]
    },
    focusClass () {
      if (this.focused) {
        return 'my-focused-table'
      } else return ''
    },
    focusClassProduto () {
      if (this.focusedProduto) {
        return 'my-focused-table'
      } else return ''
    },
    informacoesAdicionaisVenda () {
      return this.$store.getters['configPdv/informacoesAdicionaisVendaGetter']
    }
  },
  destroyed () {
    const vendaComponent = this
    document.removeEventListener('keydown', vendaComponent.keyDownHandler)
  },
  mounted () {
    const vendaComponent = this
    document.addEventListener('keydown', vendaComponent.keyDownHandler)
    setTimeout(() => {
      this.focarInput('refProduto')
    }, 300)
    const cor = this.$store.state.themes.name
    this.primary = scss[cor]
    this.cliente = this.$store.getters['bessaPdv/clienteGetter']
    this.itensVendaStore = [...this.$store.getters['bessaPdv/itensVendaGetter']]
    this.itensVenda = this.itensVendaStore.map(x => {
      return {
        item: x.item,
        fk_itemvenda_produto: x.fk_itemvenda_produto,
        nome: x.nome,
        preco: x.preco,
        precoTotal: x.precoTotal,
        quantidade: x.quantidade
      }
    })
  }
}
</script>
<style lang="scss">

  .my-sticky-header-table {
    height: auto;
    max-height: 350px;
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
    background-color: $primary;
    color: $text-color;
  }

  .secondary {
    top: 0;
    background-color: $secondary !important;
    color: $text-color;
  }

  .produtosTable div thead tr th {
    background-color: blue !important;
  }

  .custom-border-right {
    border-right: solid 1px rgba(0, 0, 0, 0.12);
  }

  .custom-header-wrapper {
    color: white;
    display: flex;
    width: 100%;
    height: 50px;
    background-color: blue;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding-right: 13px;
  }

  .custom-th {
    font-size: 12px;
    font-weight: 500;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  @media screen and (max-width: 599px) {
    .col-xs-12.q-pr-sm {
      padding-right: 0;
    }
    .col-xs-12.q-pl-sm, .col-xs-5.q-pl-sm {
      padding-left: 0;
    }
  }
</style>
