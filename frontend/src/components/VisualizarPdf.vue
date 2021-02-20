<template>
<div>
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
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="settings"
            @click="modalImpressora"
          />
          <q-tooltip>
            Escolher impressora
          </q-tooltip>
        </div>
        <div class="float-right">
          <q-btn
            flat
            dense
            round
            class="q-mr-md"
            icon="local_printshop"
            @click="imprimir"
          />
          <q-tooltip>
            Imprimir
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
  <q-dialog
      v-model="modalImpressoraAberto"
    >
      <q-card style="width: 50vw; max-width: 50vw;">
        <q-card-section :class="theme" class="card-header">
          Escolher impressora
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Impressoras:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select outlined v-model="impressoraEscolhida" :options="impressoraLista" dense options-dense>
            <template v-slot:append>
              <q-icon name="printer" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-4 offset-4">
              <q-btn :class="theme" style="width: 100%;" icon="save" class="text-white q-ml-md" label="Salvar" @click="salvarImpressora"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import themeUtil from '../components/util/ThemeUtil'
import scss from '../css/quasar.variables.json'
import VisualizarPdf from '../components/VisualizarPdf'
import * as qz from 'qz-tray'

export default {
  name: 'VisualizarPdf',
  data () {
    return {
      impressora: null,
      impressoraEscolhida: null,
      visible: true,
      modalImpressoraAberto: false,
      impressoraLista: []
    }
  },
  props: {
    url: null
  },
  methods: {
    modalImpressora () {
      this.modalImpressoraAberto = !this.modalImpressoraAberto
      this.impressoraEscolhida = this.impressora
    },
    salvarImpressora () {
      localStorage.setItem('impressora', this.impressoraEscolhida)
      this.modalImpressoraAberto = false
    },
    connectQz () {
      if (!qz.websocket.isActive()) {
        qz.websocket.connect().then(() => {
          this.carregarImpressoras()
        })
      }
    },
    carregarImpressoras () {
      if (!(this.impressoraLista.length > 0)) {
        return qz.printers.find().then((printers) => {
          this.impressoraLista = printers
          console.log(this.impressoraLista)
        })
      }
    },
    imprimir () {
      this.connectQz()
      const config = qz.configs.create(this.impressora)
      const imprimePedido = {
        type: 'pixel',
        format: 'pdf',
        flavor: 'file',
        data: this.url
      }
      return qz.print(config, [imprimePedido]).catch(error => {
        console.error(error)
        let messageError = 'Erro na impressão automática. Imprima manualmente.'
        if (error.toString().indexOf('PDF file specified could not be found') > 0) {
          messageError = 'PDF não encontrado, gere outra impressão.'
        }
        this.$q.notify({
          type: 'negative',
          message: messageError,
          timeout: 2000
        })
      })
    },
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
  },
  mounted () {
    this.connectQz()
    this.impressora = localStorage.getItem('impressora')
    this.impressoraEscolhida = this.impressora
    qz.security.setCertificatePromise(function (resolve, reject) {
      resolve('-----BEGIN CERTIFICATE-----\n' +
      'MIIDpzCCAo+gAwIBAgIUQIwDgK8WeYWYhuUFDm4MPJ18Ea8wDQYJKoZIhvcNAQEL\n' +
      'BQAwYzELMAkGA1UEBhMCQlIxFTATBgNVBAgMDE1pbmFzLUdlcmFpczEQMA4GA1UE\n' +
      'BwwHVWJlcmFiYTERMA8GA1UECgwITURVLVRlY2gxGDAWBgNVBAMMD01EVS1UZWNu\n' +
      'b2xvZ2lhczAeFw0yMDEwMTkxNDM5MjlaFw0zMDEwMTcxNDM5MjlaMGMxCzAJBgNV\n' +
      'BAYTAkJSMRUwEwYDVQQIDAxNaW5hcy1HZXJhaXMxEDAOBgNVBAcMB1ViZXJhYmEx\n' +
      'ETAPBgNVBAoMCE1EVS1UZWNoMRgwFgYDVQQDDA9NRFUtVGVjbm9sb2dpYXMwggEi\n' +
      'MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDE6madg/SRyyqY4bDH7J8fQcvP\n' +
      'DkRVSzk28MdljzPCc8SIEUSmYkczGpzDrnbp45zs1pIQyjOkXErMD58eR3UtfOGX\n' +
      'WbGN5avP4HKuFYmDBmvzq+Kt1Xo11QP2VdEut7RssydATf7JEm/UWFdPPAxUc4ei\n' +
      'wo6UQX3T45fwOQjv1ULQkVPYCLxW5aWmWgtFk1/ReJnwFbHc3OSq5dGyHKaDnJIT\n' +
      'fy5T5Dlnm1kGnDd3uh4APSgA5B+MQeeM+pz7J+3y4lqc9+Xx+MJiVwai87pl7CNV\n' +
      'RFC/GJ2FeoHLBiz5Aj7PjewtJ/BxT5VHwoA1qHa7vubfoVjjzHp/BbnLsUJXAgMB\n' +
      'AAGjUzBRMB0GA1UdDgQWBBS+9GUKFGhs2DIs6bpYiUgQXVeHFzAfBgNVHSMEGDAW\n' +
      'gBS+9GUKFGhs2DIs6bpYiUgQXVeHFzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3\n' +
      'DQEBCwUAA4IBAQCDTA5Wh9L2vOC1MOwEu022/OqQ4jwTs8yGvImmTIEypxW1rutA\n' +
      'RDOLovmuFJAQF2qWiULHBM/YpEtkGko8kDn1jUBm0Z8rWTKUmrX06/Z69jsm3QWK\n' +
      '2jnAqkqBXnq1IAhu95oEfwnV7IO/+d963PqqkrAplRbWRqCThcGRS+t29z4R9joc\n' +
      'IMezIjgNEJyabK0m+OrNSPb1zZirogy1ZQSulR6+/u7QCoH3johLZ/Y6dGasMLq5\n' +
      '2ip/aAUeO12HRf/zb5n8knwTL4xd8hXdKwJmKSUbnF3EygFvN1GxCuZl//t88XqG\n' +
      'jndJtKQ1KRZoR49VpIwCqbrx+rkdC5DW7jah\n' +
      '-----END CERTIFICATE-----\n')
    })
  }
}
</script>
<style lang="scss">
.label-center {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
