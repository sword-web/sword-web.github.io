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
                        link: "/es/introduction/",
                    },
                    {
                        text: "Iniciando",
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
                    {
                        text: "Conceptos Fundamentales",
                        items: [
                            {
                                text: "La Aplicación Sword",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Tipos de aplicación",
                                        link: "/es/fundamental-concepts/application/application-types",
                                    },
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
                                    {
                                        text: "Extracción de estructuras",
                                        link: "/es/fundamental-concepts/configuration/extract",
                                    },
                                    {
                                        text: "Unidades Especiales",
                                        link: "/es/fundamental-concepts/configuration/special-units",
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
                                text: "Controladores",
                                link: "/es/application-components/controllers",
                                items: [
                                    {
                                        text: "Controladores Web",
                                        link: "/es/application-components/controllers/web-controllers",
                                    },
                                    {
                                        text: "Controladores Socket.IO",
                                        link: "/es/application-components/controllers/socket-io-controllers",
                                    },
                                    {
                                        text: "Controladores gRPC (Próximamente)",
                                        link: "/es/application-components/controllers/grpc-controllers",
                                    },
                                ],
                            },
                            {
                                text: "Inyección de Dependencias",
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
                                text: "Interceptors",
                                link: "/es/application-components/interceptors/",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Interceptores tradicionales",
                                        link: "/es/application-components/interceptors/traditional",
                                    },
                                    {
                                        text: "Interceptores con Configuración/Parámetros",
                                        link: "/es/application-components/interceptors/with-config",
                                    },
                                    {
                                        text: "Layers con Tower",
                                        link: "/es/application-components/interceptors/tower",
                                    },
                                    {
                                        text: "Extensiones",
                                        link: "/es/application-components/interceptors/extensions",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        text: "Guías Prácticas",
                        items: [
                            {
                                text: "Web",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Validación de Datos",
                                        link: "/es/practical-guides/web/data-validation",
                                    },
                                    {
                                        text: "Manejo de Requests",
                                        link: "/es/practical-guides/web/request-handling/explanation",
                                    },
                                    {
                                        text: "Estructura de Request",
                                        link: "/es/practical-guides/web/request-handling/request-structure",
                                    },
                                    {
                                        text: "Manejo de Errores",
                                        link: "/es/practical-guides/web/request-handling/error-handling",
                                    },
                                    {
                                        text: "Extender Request",
                                        link: "/es/practical-guides/web/request-handling/extending-request",
                                    },
                                    {
                                        text: "Manejo de Respuestas",
                                        link: "/es/practical-guides/web/response-handling",
                                    },
                                ],
                            },
                            {
                                text: "Socket.IO",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Manejo de eventos",
                                        link: "/es/practical-guides/socketio/event-handling",
                                    },
                                    {
                                        text: "Validación de Datos",
                                        link: "/es/practical-guides/socketio/data-validation",
                                    },
                                    {
                                        text: "ACKs",
                                        link: "/es/practical-guides/socketio/acknowledgements",
                                    },
                                    {
                                        text: "Contexto y extensiones",
                                        link: "/es/practical-guides/socketio/context-and-extensions",
                                    },
                                ],
                            },
                            {
                                text: "Testing",
                                link: "/es/practical-guides/testing",
                            },
                        ],
                    },
                    {
                        text: "Tooling",
                        items: [
                            {
                                text: "Modo Watch y Hot Reload",
                                link: "/es/tooling/hot-reload",
                            },
                            {
                                text: "Sword CLI",
                                link: "/es/tooling/sword-cli",
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
