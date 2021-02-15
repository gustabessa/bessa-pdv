<template>
  <q-page class="flex flex-center">
    <q-card class="produtos-card q-mt-md q-mb-md">
      <q-card-section :class="theme" class="card-header">
        Cadastro de Produtos
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            v-if="id"
            icon="delete"
            @click="excluirProduto"
          />
          <q-btn
            flat
            dense
            round
            icon="add"
            @click="novoProduto"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          outlined
          v-model="model"
          debounce="700"
          @input="filterFn"
          @keyup.enter="filterFn"
          placeholder="Pesquisar Produto"
          hint="Busque pelo nome do produto"
          style="padding-bottom: 32px"
          :color='themeInput'
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
        <template v-if="table">
          <div>
            <q-table
              class="my-sticky-header-table"
              :data="data"
              :columns="columns"
              row-key="name"
              bordered
              separator="cell"
              hide-bottom
              @row-click="escolherProduto"
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
      <q-separator />
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-input :color='themeInput' dense outlined v-model="id" class="q-mb-md" label="Id" readonly />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input :color='themeInput' dense outlined v-model="nome" class="q-mb-md" label="Nome" ref="nomeProduto"/>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 q-pr-sm">
            <q-input :color='themeInput' dense outlined v-model="precoCusto" mask="#,##" fill-mask="0" reverse-fill-mask class="q-mb-md" label="Preço de Custo" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input :color='themeInput' dense outlined v-model="preco" mask="#,##" fill-mask="0" reverse-fill-mask class="q-mb-md" label="Preço de Venda" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <!-- <q-btn style="width: 40%;" outline class="btn-purple-inverse" label="Limpar" @click="limparCampos()" /> -->
        <q-btn :class="theme" style="width: 40%;" class="text-white" label="Salvar" :loading="loading" @click="criarProduto()" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import httpUtil from '../components/util/HttpUtil'
import dialog from '../components/util/DialogUtil'
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
export default {
  name: 'Produtos',
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
      data: [],
      loading: false,
      model: null,
      id: null,
      nome: '',
      preco: null,
      precoCusto: null,
      table: false
    }
  },
  methods: {
    filterFn () {
      httpUtil.doGet('/api/produto',
        data => {
          if (data && !data.hasError) {
            if (data.length > 0) {
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
          } else if (data.hasError) {
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
            message: 'Erro ao buscar.',
            timeout: 2000
          })
          this.table = false
        }, { nome: this.model })
    },
    escolherProduto (evt, row, index) {
      this.table = false
      this.id = row.id
      this.nome = row.nome
      this.preco = row.preco
      this.precoCusto = row.precoCusto
    },
    printModel () {
      console.log(this.model)
    },
    criarProduto () {
      if (!this.nome || (!this.preco || this.preco === 0)) {
        this.$q.notify({
          type: 'negative',
          message: 'Preencha os dados corretamente!',
          timeout: 2000
        })
      } else {
        this.loading = true
        const produto = {
          id: this.id,
          nome: this.nome,
          preco: this.preco.replace('.', '').replace(',', '.'),
          precoCusto: this.precoCusto ? this.precoCusto.replace('.', '').replace(',', '.') : null
        }
        const callback = {
          onSuccess: data => {
            if (data && !data.hasError) {
              this.$q.notify({
                type: 'positive',
                message: 'Produto ' + (this.id ? 'atualizado' : 'cadastrado') + ' com sucesso!',
                timeout: 2000
              })
              if (!this.id) {
                this.id = data.id
                this.nome = data.nome
                this.preco = data.preco
              }
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
            console.error(err)
            this.$q.notify({
              type: 'negative',
              message: 'Erro ao ' + (this.id ? 'atualizar' : 'cadastrar') + ' produto.',
              timeout: 2000
            })
            this.loading = false
          }
        }
        if (this.id) {
          dialog.confirm('Deseja atualizar o produto?')
            .onOk(() => httpUtil.doPut('/api/produto', produto, callback.onSuccess, callback.onError))
            .onCancel(() => { this.loading = false })
        } else {
          dialog.confirm('Deseja criar o produto?')
            .onOk(() => httpUtil.doPost('/api/produto', produto, callback.onSuccess, callback.onError))
            .onCancel(() => { this.loading = false })
        }
      }
    },
    novoProduto () {
      this.id = null
      this.nome = null
      this.preco = null
      this.precoCusto = null
      this.table = false
      this.$refs.nomeProduto.focus()
    },
    excluirProduto () {
      dialog.confirm('Deseja excluir o produto?')
        .onOk(() => {
          httpUtil.doDelete('/api/produto', { id: this.id },
            data => {
              if (data && !data.hasError) {
                this.novoProduto()
                this.$q.notify({
                  type: 'positive',
                  message: 'Produto excluído com sucesso!',
                  timeout: 2000
                })
              } else if (data.hasError) {
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
              this.$q.notify({
                type: 'negative',
                message: 'Erro ao excluir o produto.',
                timeout: 2000
              })
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
    }
  }
}
</script>
<style lang="scss">

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
