import { defineConfig, type DefaultTheme } from "vitepress";

type Locale = "en" | "es";

type PageNode = {
    key: string;
    path?: string;
    collapsed?: boolean;
    items?: PageNode[];
};

// Árbol único del sidebar. Los `path` son relativos al locale (sin /en ni /es).
const sidebarTree: PageNode[] = [
    {
        key: "first-steps",
        collapsed: true,
        items: [
            { key: "intro", path: "introduction/" },
            { key: "getting-started", path: "introduction/getting-started" },
            { key: "file-structure", path: "introduction/file-structure" },
        ],
    },
    {
        key: "fundamental-concepts",
        collapsed: false,
        items: [
            {
                key: "the-application",
                collapsed: false,
                items: [
                    {
                        key: "application-types",
                        path: "fundamental-concepts/application/application-types",
                    },
                    { key: "builder", path: "fundamental-concepts/application/builder" },
                    { key: "instance", path: "fundamental-concepts/application/instance" },
                    {
                        key: "main-function",
                        path: "fundamental-concepts/application/the-main-function",
                    },
                ],
            },
            {
                key: "configuring",
                collapsed: true,
                items: [
                    {
                        key: "config-base",
                        path: "fundamental-concepts/configuration/application",
                    },
                    { key: "config-custom", path: "fundamental-concepts/configuration/custom" },
                    { key: "config-extract", path: "fundamental-concepts/configuration/extract" },
                ],
            },
        ],
    },
    {
        key: "application-components",
        collapsed: false,
        items: [
            { key: "modules", path: "application-components/modules" },
            {
                key: "controllers",
                path: "application-components/controllers",
                collapsed: true,
                items: [
                    {
                        key: "web-controllers",
                        path: "application-components/controllers/web-controllers",
                    },
                    {
                        key: "socketio-controllers",
                        path: "application-components/controllers/socket-io-controllers",
                    },
                    {
                        key: "grpc-controllers",
                        path: "application-components/controllers/grpc-controllers",
                    },
                ],
            },
            {
                key: "dependency-injection",
                path: "application-components/di/",
                collapsed: true,
                items: [
                    { key: "providers", path: "application-components/di/providers" },
                    { key: "components", path: "application-components/di/components" },
                ],
            },
            { key: "interceptors", path: "application-components/interceptors/" },
        ],
    },
    {
        key: "practical-guides",
        collapsed: true,
        items: [
            {
                key: "web",
                collapsed: true,
                items: [
                    { key: "web-request-flow", path: "practical-guides/web/request-flow" },
                    { key: "web-request-structure", path: "practical-guides/web/request-structure" },
                    { key: "web-data-validation", path: "practical-guides/web/data-validation" },
                    { key: "web-response-handling", path: "practical-guides/web/response-handling" },
                    { key: "web-error-handling", path: "practical-guides/web/error-handling" },
                    { key: "web-interceptors", path: "practical-guides/web/interceptors" },
                    { key: "web-streaming", path: "practical-guides/web/streaming" },
                    { key: "web-openapi", path: "practical-guides/web/openapi" },
                    { key: "web-access-logger", path: "practical-guides/web/access-logger" },
                ],
            },
            {
                key: "socketio",
                collapsed: true,
                items: [
                    {
                        key: "socketio-event-handling",
                        path: "practical-guides/socketio/event-handling",
                    },
                    {
                        key: "socketio-data-validation",
                        path: "practical-guides/socketio/data-validation",
                    },
                    {
                        key: "socketio-acknowledgements",
                        path: "practical-guides/socketio/acknowledgements",
                    },
                    {
                        key: "socketio-interceptors",
                        path: "practical-guides/socketio/interceptors",
                    },
                ],
            },
            {
                key: "grpc",
                collapsed: true,
                items: [
                    {
                        key: "grpc-tonic-fundamentals",
                        path: "practical-guides/grpc/tonic-fundamentals",
                    },
                    {
                        key: "grpc-api-reference",
                        path: "practical-guides/grpc/api-reference-grpc",
                    },
                    { key: "grpc-proto-files", path: "practical-guides/grpc/proto-files" },
                    {
                        key: "grpc-compiling-protos",
                        path: "practical-guides/grpc/compiling-protos",
                    },
                    { key: "grpc-errors", path: "practical-guides/grpc/grpc-errors" },
                    { key: "grpc-interceptors", path: "practical-guides/grpc/interceptors" },
                    {
                        key: "grpc-service-inspection",
                        path: "practical-guides/grpc/service-inspection-grpcurl",
                    },
                    { key: "grpc-access-logger", path: "practical-guides/grpc/access-logger" },
                ],
            },
        ],
    },
    {
        key: "complements",
        collapsed: true,
        items: [
            { key: "tracing", path: "complements/tracing" },
            { key: "auto-layers", path: "complements/auto-layers" },
            { key: "hot-reload", path: "complements/hot-reload" },
            { key: "sword-cli", path: "complements/sword-cli" },
        ],
    },
];

const labels: Record<Locale, Record<string, string>> = {
    en: {
        "first-steps": "Getting Started",
        intro: "What is Sword?",
        "getting-started": "Getting Started",
        "file-structure": "File Structure",

        "fundamental-concepts": "Fundamental Concepts",
        "the-application": "The Sword Application",
        "application-types": "Application Types",
        builder: "Application Builder",
        instance: "Application Instance",
        "main-function": "The main function",
        configuring: "Configuring the application",
        "config-base": "Base configuration",
        "config-custom": "Custom",
        "config-extract": "Extraction",

        "application-components": "Application Components",
        modules: "Modules",
        controllers: "Controllers",
        "web-controllers": "Web Controllers",
        "socketio-controllers": "Socket.IO Controllers",
        "grpc-controllers": "gRPC Controllers",
        "dependency-injection": "Dependency Injection",
        providers: "Providers",
        components: "Components",
        interceptors: "Interceptors",

        "practical-guides": "Practical Guides",
        web: "Web",
        "web-request-flow": "Request Flow",
        "web-request-structure": "Request Structure",
        "web-data-validation": "Data Validation",
        "web-response-handling": "Response Handling",
        "web-error-handling": "Error Handling",
        "web-interceptors": "Interceptors",
        "web-streaming": "Streaming",
        "web-openapi": "OpenAPI & Swagger UI",
        "web-access-logger": "Access Logger",
        socketio: "Socket.IO",
        "socketio-event-handling": "Event Handling",
        "socketio-data-validation": "Data Validation",
        "socketio-acknowledgements": "Acknowledgements",
        "socketio-interceptors": "Interceptors",
        grpc: "gRPC",
        "grpc-tonic-fundamentals": "Tonic Fundamentals",
        "grpc-api-reference": "gRPC API Reference",
        "grpc-proto-files": ".proto files",
        "grpc-compiling-protos": "Compiling Protos",
        "grpc-errors": "gRPC Errors",
        "grpc-interceptors": "Interceptors",
        "grpc-service-inspection": "Service Inspection with grpcurl",
        "grpc-access-logger": "Access Logger",

        complements: "Complements",
        tracing: "Tracing & Logging",
        "auto-layers": "Built-in Tower Layers",
        "hot-reload": "Watch Mode & Hot Reload",
        "sword-cli": "Sword CLI",
    },
    es: {
        "first-steps": "Primeros pasos",
        intro: "¿Qué es Sword?",
        "getting-started": "Iniciando",
        "file-structure": "Estructura de archivos",

        "fundamental-concepts": "Conceptos fundamentales",
        "the-application": "La aplicación Sword",
        "application-types": "Tipos de aplicación",
        builder: "Constructor de aplicación",
        instance: "Instancia de aplicación",
        "main-function": "La función main",
        configuring: "Configurando la aplicación",
        "config-base": "Configuración base",
        "config-custom": "Personalizada",
        "config-extract": "Extracción",

        "application-components": "Componentes de la aplicación",
        modules: "Módulos",
        controllers: "Controladores",
        "web-controllers": "Controladores Web",
        "socketio-controllers": "Controladores Socket.IO",
        "grpc-controllers": "Controladores gRPC",
        "dependency-injection": "Inyección de dependencias",
        providers: "Providers",
        components: "Components",
        interceptors: "Interceptores",

        "practical-guides": "Guías prácticas",
        web: "Web",
        "web-request-flow": "El flujo de una petición",
        "web-request-structure": "Estructura de Request",
        "web-data-validation": "Validación de datos",
        "web-response-handling": "Manejo de respuestas",
        "web-error-handling": "Manejo de errores",
        "web-interceptors": "Interceptores",
        "web-streaming": "Streaming",
        "web-openapi": "OpenAPI y Swagger UI",
        "web-access-logger": "Access Logger",
        socketio: "Socket.IO",
        "socketio-event-handling": "Manejo de eventos",
        "socketio-data-validation": "Validación de datos",
        "socketio-acknowledgements": "Acknowledgements",
        "socketio-interceptors": "Interceptores",
        grpc: "gRPC",
        "grpc-tonic-fundamentals": "Fundamentos de tonic",
        "grpc-api-reference": "API Reference gRPC",
        "grpc-proto-files": "Ficheros .proto",
        "grpc-compiling-protos": "Compilando protos",
        "grpc-errors": "Errores gRPC",
        "grpc-interceptors": "Interceptors",
        "grpc-service-inspection": "Inspección con grpcurl",
        "grpc-access-logger": "Access Logger",

        complements: "Complementos",
        tracing: "Tracing y logging",
        "auto-layers": "Layers de Tower integradas",
        "hot-reload": "Modo Watch y Hot Reload",
        "sword-cli": "CLI",
    },
};

function buildSidebar(locale: Locale): DefaultTheme.SidebarItem[] {
    const build = (nodes: PageNode[]): DefaultTheme.SidebarItem[] =>
        nodes.map((node) => ({
            text: labels[locale][node.key],
            ...(node.path ? { link: `/${locale}/${node.path}` } : {}),
            ...(node.items ? { items: build(node.items) } : {}),
            ...(node.collapsed !== undefined ? { collapsed: node.collapsed } : {}),
        }));

    return build(sidebarTree);
}

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
    title: "Sword",
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
                sidebar: buildSidebar("en"),
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
                sidebar: buildSidebar("es"),
            },
        },
    },
    themeConfig: {
        siteTitle: "",
        socialLinks: [{ icon: "github", link: "https://github.com/sword-web" }],
    },
    markdown: {
        lineNumbers: true,
    },
});
