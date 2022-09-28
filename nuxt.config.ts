export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/eslint-module'
  ],
  css: ['@/assets/main.css', 'vuetify/lib/styles/main.sass'],
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
