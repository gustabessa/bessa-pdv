import { Dialog } from 'quasar'

export default {
  confirm (msg) {
    return Dialog.create({
      title: 'Confirmação',
      message: msg,
      cancel: true,
      persistent: true
    })
  }
}
