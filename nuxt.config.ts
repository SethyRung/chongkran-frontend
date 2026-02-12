export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
    "@sentry/nuxt/module",
  ],

  css: ["~/assets/css/main.css", "~/assets/css/tailwind.css"],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: "system",
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "",
      atMaxAge: "",
      rtMaxAge: "",
      sentry: {
        dns: "",
      },
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: "sethy-rung",
      project: "chongkran",
    },
    autoInjectServerSentry: "top-level-import",
    enabled: process.env.ENV === "production",
  },

  sourcemap: {
    client: "hidden",
  },
});
