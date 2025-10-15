import { defineConfig } from "vitepress";

export default defineConfig({
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  title: "Sword Web Framework",
  description: "Sword Web Framework Documentation",
  base: "/docs/",
  locales: {
    en: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          {
            text: "Examples",
            link: "https://github.com/sword-web/sword/tree/main/examples",
          },
        ],
        sidebar: [
          {
            text: "Introduction",
            items: [
              { text: "How to start?", link: "/en/introduction/how-to-start" },
              {
                text: "Project structure",
                link: "/en/introduction/project-structure",
              },
              { text: "Ecosystem", link: "/en/introduction/ecosystem" },
            ],
          },
          {
            text: "Key Concepts",
            items: [
              {
                text: "The `Application` structure",
                link: "/en/key-concepts/application-structure",
              },
              {
                text: "Application configuration",
                link: "/en/key-concepts/application-configuration",
              },
              {
                text: "Custom configuration",
                link: "/en/key-concepts/custom-configuration",
              },
              {
                text: "Controllers and Routes",
                link: "/en/key-concepts/controllers-routes",
              },
              {
                text: "Context and Request Handling",
                link: "/en/key-concepts/context-requests",
              },
              {
                text: "Data Validation",
                link: "/en/key-concepts/data-validation",
              },
              {
                text: "Middlewares",
                items: [
                  {
                    text: "Common Middlewares",
                    link: "/en/key-concepts/middlewares/common",
                  },
                  {
                    text: "Middlewares with Configuration/Parameters",
                    link: "/en/key-concepts/middlewares/with-config",
                  },
                  {
                    text: "Tower Middleware",
                    link: "/en/key-concepts/middlewares/tower",
                  },
                  {
                    text: "Extensions",
                    link: "/en/key-concepts/middlewares/extensions",
                  },
                ],
              },
              {
                text: "Dependency Injection (DI)",
                link: "/en/key-concepts/dependency-injection",
              },
            ],
          },
          {
            text: "Advanced Concepts",
            items: [
              { text: "Cookies", link: "/en/advanced-concepts/cookies" },
              {
                text: "Multipart/Form Data Handling",
                link: "/en/advanced-concepts/multipart-form-data",
              },
              { text: "Security", link: "/en/advanced-concepts/security" },
              { text: "Testing", link: "/en/advanced-concepts/testing" },
              { text: "Hot Reload", link: "/en/advanced-concepts/hot-reload" },
            ],
          },
          {
            text: "Examples",
            items: [
              { text: "Basic Examples", link: "/en/examples/basic-examples" },
              {
                text: "Advanced Examples",
                link: "/en/examples/advanced-examples",
              },
            ],
          },
          { text: "Changelog and Roadmap", link: "/en/changelog-roadmap/mod" },
        ],
      },
    },
    es: {
      label: "Español",
      lang: "es",
      themeConfig: {
        nav: [
          { text: "Inicio", link: "/es/" },
          {
            text: "Ejemplos",
            link: "https://github.com/sword-web/sword/tree/main/examples",
          },
        ],
        sidebar: [
          {
            text: "Introducción",
            items: [
              { text: "¿Cómo empezar?", link: "/es/introduction/how-to-start" },
              {
                text: "Estructura de un proyecto",
                link: "/es/introduction/project-structure",
              },
              { text: "Ecosistema", link: "/es/introduction/ecosystem" },
            ],
          },
          {
            text: "Conceptos Clave",
            items: [
              {
                text: "La estructura `Application`",
                link: "/es/key-concepts/application-structure",
              },
              {
                text: "Configuración de la aplicación",
                link: "/es/key-concepts/application-configuration",
              },
              {
                text: "Configuración personalizada",
                link: "/es/key-concepts/custom-configuration",
              },
              {
                text: "Controladores y Rutas",
                link: "/es/key-concepts/controllers-routes",
              },
              {
                text: "Manejo de Contexto y Peticiones",
                link: "/es/key-concepts/context-requests",
              },
              {
                text: "Validación de Datos",
                link: "/es/key-concepts/data-validation",
              },
              {
                text: "Middlewares",
                items: [
                  {
                    text: "Middlewares Comunes",
                    link: "/es/key-concepts/middlewares/common",
                  },
                  {
                    text: "Middlewares con Configuración/Parámetros",
                    link: "/es/key-concepts/middlewares/with-config",
                  },
                  {
                    text: "Tower Middleware",
                    link: "/es/key-concepts/middlewares/tower",
                  },
                  {
                    text: "Extensiones",
                    link: "/es/key-concepts/middlewares/extensions",
                  },
                ],
              },
              {
                text: "Inyección de Dependencias (DI)",
                link: "/es/key-concepts/dependency-injection",
              },
            ],
          },
          {
            text: "Conceptos avanzados",
            items: [
              { text: "Cookies", link: "/es/advanced-concepts/cookies" },
              {
                text: "Manejo de Multipart/Form Data",
                link: "/es/advanced-concepts/multipart-form-data",
              },
              { text: "Seguridad", link: "/es/advanced-concepts/security" },
              { text: "Testing", link: "/es/advanced-concepts/testing" },
              {
                text: "Hot Reload",
                link: "/es/advanced-concepts/hot-reload",
              },
            ],
          },
          {
            text: "Ejemplos",
            items: [
              { text: "Ejemplos Básicos", link: "/es/examples/basic-examples" },
              {
                text: "Ejemplos Avanzados",
                link: "/es/examples/advanced-examples",
              },
            ],
          },
          { text: "Changelog y Roadmap", link: "/es/changelog-roadmap/mod" },
        ],
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/sword-web" }],
    logo: "/logo.png",
  },
});
