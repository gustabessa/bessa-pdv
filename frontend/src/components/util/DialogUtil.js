import { Dialog } from 'quasar'

export default {
  confirm (msg) {
    return Dialog.create({
      title: 'Confirmação',
      message: msg,
      cancel: true,
      persistent: true
    })
  },
  prompt (msg) {
    return Dialog.create({
      message: msg,
      cancel: true,
      prompt: {
        model: '',
        type: 'text'
      },
      persistent: true
    })
  }
}
