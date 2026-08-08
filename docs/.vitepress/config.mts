import { defineConfig } from "vitepress";

export default defineConfig({
    appearance: "dark",
    head: [
        ["link", { rel: "icon", href: "/logo-squared.png" }],
        ["meta", { name: "author", content: "Luciano Revillod" }],
        [
            "meta",
            {
                name: "keywords",
                content: "rust, framework, web, axum, sword, documentation",
            },
        ],
        ["meta", { name: "theme-color", content: "#111111" }],
    ],
    title: " ",
    description: "Sword Web Framework Documentation",
    base: "/",
    rewrites: (page) => {
        if (!page.startsWith("es/") && !page.startsWith("en/")) return page;

        return page
            .split("/")
            .map((segment, index) =>
                index === 0 ? segment : segment.replace(/^\d+-/, ""),
            )
            .join("/");
    },
    locales: {
        en: {
            label: "English",
            lang: "en",
            themeConfig: {
                logo: {
                    dark: "/logo-new.png",
                    light: "/logo-new-dark.png",
                },
                nav: [
                    { text: "Home", link: "/en/" },
                    {
                        text: "Examples",
                        link: "https://github.com/sword-web/sword/tree/main/examples",
                    },
                ],
                sidebar: [
                    {
                        text: "Introduction",
                        link: "/en/introduction/",
                    },
                    {
                        text: "Getting Started",
                        link: "/en/introduction/getting-started",
                    },
                    {
                        text: "File Structure",
                        link: "/en/introduction/file-structure",
                    },
                    {
                        text: "Fundamental Concepts",
                        items: [
                            {
                                text: "The Sword Application",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Application Types",
                                        link: "/en/fundamental-concepts/application/application-types",
                                    },
                                    {
                                        text: "Application Builder",
                                        link: "/en/fundamental-concepts/application/builder",
                                    },
                                    {
                                        text: "Application Instance",
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
                                        text: "Base configuration",
                                        link: "/en/fundamental-concepts/configuration/application",
                                    },
                                    {
                                        text: "Custom",
                                        link: "/en/fundamental-concepts/configuration/custom",
                                    },
                                    {
                                        text: "Extraction",
                                        link: "/en/fundamental-concepts/configuration/extract",
                                    },
                                ],
                            },
                            {
                                text: "Complements",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Tracing & Logging",
                                        link: "/en/complements/tracing",
                                    },
                                    {
                                        text: "Auto-registered Layers & Services",
                                        link: "/en/complements/auto-layers",
                                    },
                                    {
                                        text: "Watch Mode & Hot Reload",
                                        link: "/en/complements/hot-reload",
                                    },
                                    {
                                        text: "Sword CLI",
                                        link: "/en/complements/sword-cli",
                                    },
                                ],
                            },
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
                                text: "Controllers",
                                link: "/en/application-components/controllers",
                                items: [
                                    {
                                        text: "Web Controllers",
                                        link: "/en/application-components/controllers/web-controllers",
                                    },
                                    {
                                        text: "Socket.IO Controllers",
                                        link: "/en/application-components/controllers/socket-io-controllers",
                                    },
                                    {
                                        text: "gRPC Controllers",
                                        link: "/en/application-components/controllers/grpc-controllers",
                                    },
                                ],
                            },
                            {
                                text: "Dependency Injection",
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
                                ],
                            },
                            {
                                text: "Interceptors",
                                link: "/en/application-components/interceptors/",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Traditional Interceptors",
                                        link: "/en/application-components/interceptors/traditional",
                                    },
                                    {
                                        text: "Interceptors with Config/Params",
                                        link: "/en/application-components/interceptors/with-config",
                                    },
                                    {
                                        text: "Tower Layers",
                                        link: "/en/application-components/interceptors/tower",
                                    },
                                    {
                                        text: "Extensions",
                                        link: "/en/application-components/interceptors/extensions",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        text: "Practical Guides",
                        items: [
                            {
                                text: "Web",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Data Validation",
                                        link: "/en/practical-guides/web/data-validation",
                                    },
                                    {
                                        text: "Request Handling",
                                        link: "/en/practical-guides/web/request-handling/explanation",
                                    },
                                    {
                                        text: "Request Structure",
                                        link: "/en/practical-guides/web/request-handling/request-structure",
                                    },
                                    {
                                        text: "Error Handling",
                                        link: "/en/practical-guides/web/request-handling/error-handling",
                                    },
                                    {
                                        text: "Extending Request",
                                        link: "/en/practical-guides/web/request-handling/extending-request",
                                    },
                                    {
                                        text: "Response Handling",
                                        link: "/en/practical-guides/web/response-handling",
                                    },
                                    {
                                        text: "OpenAPI & Swagger UI",
                                        link: "/en/practical-guides/web/openapi",
                                    },
                                ],
                            },
                            {
                                text: "Socket.IO",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Event Handling",
                                        link: "/en/practical-guides/socketio/event-handling",
                                    },
                                    {
                                        text: "Data Validation",
                                        link: "/en/practical-guides/socketio/data-validation",
                                    },
                                    {
                                        text: "ACKs",
                                        link: "/en/practical-guides/socketio/acknowledgements",
                                    },
                                    {
                                        text: "Context & Extensions",
                                        link: "/en/practical-guides/socketio/context-and-extensions",
                                    },
                                ],
                            },
                            {
                                text: "gRPC",
                                collapsed: true,
                                items: [
                                    {
                                        text: ".proto files",
                                        link: "/en/practical-guides/grpc/ficheros-proto",
                                    },
                                    {
                                        text: "Tonic Fundamentals",
                                        link: "/en/practical-guides/grpc/fundamentos-de-tonic",
                                    },
                                    {
                                        text: "Service Inspection with grpcurl",
                                        link: "/en/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl",
                                    },
                                    {
                                        text: "gRPC Errors",
                                        link: "/en/practical-guides/grpc/errores-grpc",
                                    },
                                ],
                            },
                            {
                                text: "Testing",
                                link: "/en/practical-guides/testing",
                            },
                        ],
                    },
                ],
            },
        },
        es: {
            label: "Español",
            lang: "es",
            themeConfig: {
                logo: {
                    dark: "/logo-new.png",
                    light: "/logo-new-dark.png",
                },
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
                        text: "Estructura de archivos",
                        link: "/es/introduction/file-structure",
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
                                        text: "Configuración base",
                                        link: "/es/fundamental-concepts/configuration/application",
                                    },
                                    {
                                        text: "Personalizada",
                                        link: "/es/fundamental-concepts/configuration/custom",
                                    },
                                    {
                                        text: "Extracción",
                                        link: "/es/fundamental-concepts/configuration/extract",
                                    },
                                ],
                            },
                            {
                                text: "Complementos",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Tracing y Logging",
                                        link: "/es/complements/tracing",
                                    },
                                    {
                                        text: "Tower Layers Built-in",
                                        link: "/es/complements/auto-layers",
                                    },
                                    {
                                        text: "Modo Watch y Hot Reload",
                                        link: "/es/complements/hot-reload",
                                    },
                                    {
                                        text: "CLI",
                                        link: "/es/complements/sword-cli",
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
                                        text: "Controladores gRPC",
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
                                        text: "Components",
                                        link: "/es/application-components/di/components",
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
                                    {
                                        text: "OpenAPI y Swagger UI",
                                        link: "/es/practical-guides/web/openapi",
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
                                text: "gRPC",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Ficheros .proto",
                                        link: "/es/practical-guides/grpc/ficheros-proto",
                                    },
                                    {
                                        text: "Fundamentos de tonic",
                                        link: "/es/practical-guides/grpc/fundamentos-de-tonic",
                                    },
                                    {
                                        text: "Inspección con grpcurl",
                                        link: "/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl",
                                    },
                                    {
                                        text: "Errores gRPC",
                                        link: "/es/practical-guides/grpc/errores-grpc",
                                    },
                                ],
                            },
                            {
                                text: "Testing",
                                link: "/es/practical-guides/testing",
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
