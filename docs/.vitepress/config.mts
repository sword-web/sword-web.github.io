import { defineConfig } from "vitepress";

export default defineConfig({
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }], ['meta', { name: 'author', content: 'Luciano Revillod' }],
    ['meta', { name: 'keywords', content: 'rust, framework, web, axum, sword, documentación' }],
    ['meta', { name: 'theme-color', content: '#111111' }],
  ],
  title: "Sword Web Framework",
  description: "Sword Web Framework Documentation",
  base: "/",
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
            link: "/en/introduction/",
            items: [
              { text: "Getting Started", link: "/en/introduction/getting-started" },
              {
                text: "Project structure",
                link: "/en/introduction/project-structure",
              },
              { text: "Ecosystem", link: "/en/introduction/ecosystem" },
            ],
          },
          {
            text: "Fundamental Concepts",
            items: [
              {
                text: "The Sword Application",
                collapsed: true,
                items: [
                  {
                    text: "Application builder",
                    link: "/en/fundamental-concepts/application/builder",
                  },
                  {
                    text: "Application instance",
                    link: "/en/fundamental-concepts/application/instance",
                  },
                  {
                    text: "The main function",
                    link: "/en/fundamental-concepts/application/the-main-function",
                  },
                ],
              },
              {
                text: "Configuring the application",
                collapsed: true,
                items: [
                  {
                    text: "Application Configuration",
                    link: "/en/fundamental-concepts/configuration/application",
                  },
                  {
                    text: "Custom Configuration",
                    link: "/en/fundamental-concepts/configuration/custom",
                  },
                ],
              },
              {
                text: "Built-in Tower Middlewares",
                link: "/en/fundamental-concepts/built-in-mws/",
                collapsed: true,
                items: [
                  {
                    text: "Compression",
                    link: "/en/fundamental-concepts/built-in-mws/compression",
                  },
                  {
                    text: "CORS",
                    link: "/en/fundamental-concepts/built-in-mws/cors",
                  },
                  {
                    text: "Helmet - Security Headers",
                    link: "/en/fundamental-concepts/built-in-mws/helmet",
                  },
                  {
                    text: "Http Logger (Coming Soon)",
                  },
                  {
                    text: "Request Body Limit",
                    link: "/en/fundamental-concepts/built-in-mws/request-body-limit",
                  },
                  {
                    text: "Request Id",
                    link: "/en/fundamental-concepts/built-in-mws/request-id",
                  },
                  {
                    text: "Request Timeout",
                    link: "/en/fundamental-concepts/built-in-mws/request-timeout",
                  },
                ],
              }
            ],
            },
          {
            text: "Application Components",
            items: [
              {
                text: "Modules",
                link: "/en/application-components/modules",
              },
              {
                text: "Gateways",
                link: "/en/application-components/gateways/",
                items: [
                  {
                    text: "REST Controllers",
                    link: "/en/application-components/gateways/rest-controller",
                  },
                  {
                    text: "SocketIO Controllers",
                    link: "/en/application-components/gateways/socketio-controller",
                  },
                  {
                    text: "gRPC Controllers (Coming Soon)",
                    link: "/en/application-components/gateways/grpc-controller",
                  },
                ],
              },
              {
                text: "Injectables",
                link: "/en/application-components/di/",
                items: [
                  {
                    text: "Providers",
                    link: "/en/application-components/di/providers",
                  },
                  {
                    text: "Components",
                    link: "/en/application-components/di/components",
                  },
                  {
                    text: "Injecting injectables",
                    link: "/en/application-components/di/injecting",
                  }
                ],
              },
              {
                text: "Middlewares and Layers",
                link: "/en/application-components/middlewares-and-layers",
                collapsed: true,
                items: [
                  {
                    text: "Simple Middlewares",
                    link: "/en/application-components/middlewares-and-layers/simple-middlewares",
                  },
                  {
                    text: "Middlewares with Configuration/Parameters",
                    link: "/en/application-components/middlewares-and-layers/middlewares-with-config",
                  },
                  {
                    text: "Tower Middleware",
                    link: "/en/application-components/middlewares-and-layers/tower-middleware",
                  },
                  {
                    text: "Extensions",
                    link: "/en/application-components/middlewares-and-layers/extensions",
                  },
                ],
              },
            ],
          },
          {
            text: "Extra Concepts",
            items: [
              {
                text: "Watch Mode and Hot Reload",
                link: "/en/extra-concepts/hot-reload",
              },
              {
                text: "Sword CLI",
                link: "/en/extra-concepts/sword-cli",
              },
              {
                text: "Testing",
                link: "/en/extra-concepts/testing",
              }
            ]
          }
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
              { text: "Comenzando", link: "/es/introduction/getting-started" },
              {
                text: "Estructura del proyecto",
                link: "/es/introduction/project-structure",
              },
              { text: "Ecosistema", link: "/es/introduction/ecosystem" },
            ],
          },
          {
            text: "Conceptos Fundamentales",
            items: [
              {
                text: "La Aplicación Sword",
                collapsed: true,
                items: [
                  {
                    text: "Constructor de aplicación",
                    link: "/es/fundamental-concepts/application/builder",
                  },
                  {
                    text: "Instancia de aplicación",
                    link: "/es/fundamental-concepts/application/instance",
                  },
                  {
                    text: "La función main",
                    link: "/es/fundamental-concepts/application/the-main-function",
                  },
                ],
              },
              {
                text: "Configurando la aplicación",
                collapsed: true,
                items: [
                  {
                    text: "Configuración de Aplicación",
                    link: "/es/fundamental-concepts/configuration/application",
                  },
                  {
                    text: "Configuración Personalizada",
                    link: "/es/fundamental-concepts/configuration/custom",
                  },
                ],
              },
              {
                text: "Middlewares Tower Integrados",
                link: "/es/fundamental-concepts/built-in-mws/",
                collapsed: true,
                items: [
                  {
                    text: "Compresión",
                    link: "/es/fundamental-concepts/built-in-mws/compression",
                  },
                  {
                    text: "CORS",
                    link: "/es/fundamental-concepts/built-in-mws/cors",
                  },
                  {
                    text: "Helmet - Headers de Seguridad",
                    link: "/es/fundamental-concepts/built-in-mws/helmet",
                  },
                  {
                    text: "Logger HTTP (Próximamente)",
                  },
                  {
                    text: "Body limit",
                    link: "/es/fundamental-concepts/built-in-mws/request-body-limit",
                  },
                  {
                    text: "Request ID",
                    link: "/es/fundamental-concepts/built-in-mws/request-id",
                  },
                  {
                    text: "Request Timeout",
                    link: "/es/fundamental-concepts/built-in-mws/request-timeout",
                  },
                ],
              }
            ],
            },
          {
            text: "Componentes de Aplicación",
            items: [
              {
                text: "Módulos",
                link: "/es/application-components/modules",
              },
              {
                text: "Gateways",
                link: "/es/application-components/gateways/",
                items: [
                  {
                    text: "Controladores REST",
                    link: "/es/application-components/gateways/rest-controller",
                  },
                  {
                    text: "Controladores SocketIO",
                    link: "/es/application-components/gateways/socketio-controller",
                  },
                  {
                    text: "Controladores gRPC (Próximamente)",
                    link: "/es/application-components/gateways/grpc-controller",
                  },
                ],
              },
              {
                text: "Inyectables",
                link: "/es/application-components/di/",
                items: [
                  {
                    text: "Providers",
                    link: "/es/application-components/di/providers",
                  },
                  {
                    text: "Componentes",
                    link: "/es/application-components/di/components",
                  },
                  {
                    text: "Inyectando dependencias",
                    link: "/es/application-components/di/injecting",
                  }
                ],
              },
              {
                text: "Middlewares y Capas",
                link: "/es/application-components/middlewares-and-layers",
                collapsed: true,
                items: [
                  {
                    text: "Middlewares Simples",
                    link: "/es/application-components/middlewares-and-layers/simple-middlewares",
                  },
                  {
                    text: "Middlewares con Configuración/Parámetros",
                    link: "/es/application-components/middlewares-and-layers/middlewares-with-config",
                  },
                  {
                    text: "Middleware Tower",
                    link: "/es/application-components/middlewares-and-layers/tower-middleware",
                  },
                  {
                    text: "Extensiones",
                    link: "/es/application-components/middlewares-and-layers/extensions",
                  },
                ],
              },
            ],
          },
          {
            text: "Conceptos Extra",
            items: [
              {
                text: "Modo Watch y Hot Reload",
                link: "/es/extra-concepts/hot-reload",
              },
              {
                text: "Sword CLI",
                link: "/es/extra-concepts/sword-cli",
              },
              {
                text: "Testing",
                link: "/es/extra-concepts/testing",
              }
            ]
          }
        ],
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/sword-web" }],
    logo: {
      light: "/favicon-inverse.ico",
      dark: "/favicon.png",
    }
  },
  markdown: {
    lineNumbers: true,
  }
});
