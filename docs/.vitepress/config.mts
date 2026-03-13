import { defineConfig } from "vitepress";

export default defineConfig({
    appearance: "dark",
    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        ["meta", { name: "author", content: "Luciano Revillod" }],
        [
            "meta",
            {
                name: "keywords",
                content: "rust, framework, web, axum, sword, documentación",
            },
        ],
        ["meta", { name: "theme-color", content: "#111111" }],
    ],
    title: "Sword Web Framework",
    description: "Sword Web Framework Documentation",
    base: "/",
    rewrites: (page) => {
        if (!page.startsWith("es/")) return page;

        return page
            .split("/")
            .map((segment, index) =>
                index === 0 ? segment : segment.replace(/^\d+-/, ""),
            )
            .join("/");
    },
    locales: {
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
                            {
                                text: "Comenzando",
                                link: "/es/introduction/getting-started",
                            },
                            {
                                text: "Estructura del proyecto",
                                link: "/es/introduction/project-structure",
                            },
                            {
                                text: "Ecosistema",
                                link: "/es/introduction/ecosystem",
                            },
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
                            },
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
                                    },
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
                            },
                        ],
                    },
                ],
            },
        },
    },
    themeConfig: {
        socialLinks: [{ icon: "github", link: "https://github.com/sword-web" }],
    },
    markdown: {
        lineNumbers: true,
    },
});
