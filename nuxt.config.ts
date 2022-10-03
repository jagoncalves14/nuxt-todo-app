import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/eslint-module',
    // @ts-ignore
    // eslint-disable-next-line require-await
    async (_options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
        vuetify()
      ))
    }
  ],
  css: ['@/assets/main.css', 'vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  components: true,
  content: {
    highlight: {
      // Theme used in all color schemes.
      theme: 'github-dark',
      preload: ['vue']
    }
  }
})
