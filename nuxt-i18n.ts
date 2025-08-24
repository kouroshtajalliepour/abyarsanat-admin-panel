import messages from "./messages"

export default defineI18nConfig(() => {
    return {
      legacy: false,
      locale: 'en',
      messages
    }
})