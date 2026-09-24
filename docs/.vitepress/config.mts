import { defineConfig, type DefaultTheme } from "vitepress"

type Locale = "en" | "es"

type PageNode = {
	key: string
	path?: string
	collapsed?: boolean
	items?: PageNode[]
}

const sidebarTree: PageNode[] = [
	{
		key: "first-steps",
		collapsed: false,
		items: [
			{ key: "intro", path: "introduction/" },
			{ key: "getting-started", path: "introduction/getting-started" },
			{
				key: "application-types",
				path: "introduction/application-types",
			},
			{ key: "file-structure", path: "introduction/file-structure" },
		],
	},
	{
		key: "fundamental-concepts",
		collapsed: false,
		items: [
			{ key: "application", path: "fundamental-concepts/application" },
			{
				key: "configuration",
				path: "fundamental-concepts/configuration",
			},
			{ key: "modules", path: "fundamental-concepts/modules" },
			{ key: "controllers", path: "fundamental-concepts/controllers" },
			{
				key: "dependency-injection",
				path: "fundamental-concepts/dependency-injection",
			},
			{ key: "interceptors", path: "fundamental-concepts/interceptors" },
			{
				key: "error-handling",
				path: "fundamental-concepts/error-handling",
			},
		],
	},
	{
		key: "practical-guides",
		collapsed: false,
		items: [
			{
				key: "web",
				collapsed: true,
				items: [
					{
						key: "web-configuration",
						path: "practical-guides/web/configuration",
					},
					{
						key: "web-controllers",
						path: "practical-guides/web/controllers",
					},
					{
						key: "web-request-flow",
						path: "practical-guides/web/request-flow",
					},
					{
						key: "web-request-structure",
						path: "practical-guides/web/request-structure",
					},
					{
						key: "web-data-validation",
						path: "practical-guides/web/data-validation",
					},
					{
						key: "web-response-handling",
						path: "practical-guides/web/response-handling",
					},
					{
						key: "web-error-handling",
						path: "practical-guides/web/error-handling",
					},
					{
						key: "web-interceptors",
						path: "practical-guides/web/interceptors",
					},
					{
						key: "web-streaming",
						path: "practical-guides/web/streaming",
					},
					{
						key: "web-openapi",
						path: "practical-guides/web/openapi",
					},
					{
						key: "web-access-logger",
						path: "practical-guides/web/access-logger",
					},
				],
			},
			{
				key: "socketio",
				collapsed: true,
				items: [
					{
						key: "socketio-configuration",
						path: "practical-guides/socketio/configuration",
					},
					{
						key: "socketio-controllers",
						path: "practical-guides/socketio/controllers",
					},
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
						key: "grpc-configuration",
						path: "practical-guides/grpc/configuration",
					},
					{
						key: "grpc-controllers",
						path: "practical-guides/grpc/controllers",
					},
					{
						key: "grpc-tonic-fundamentals",
						path: "practical-guides/grpc/tonic-fundamentals",
					},
					{
						key: "grpc-api-reference",
						path: "practical-guides/grpc/api-reference-grpc",
					},
					{
						key: "grpc-proto-files",
						path: "practical-guides/grpc/proto-files",
					},
					{
						key: "grpc-compiling-protos",
						path: "practical-guides/grpc/compiling-protos",
					},
					{
						key: "grpc-errors",
						path: "practical-guides/grpc/grpc-errors",
					},
					{
						key: "grpc-interceptors",
						path: "practical-guides/grpc/interceptors",
					},
					{
						key: "grpc-service-inspection",
						path: "practical-guides/grpc/service-inspection-grpcurl",
					},
					{
						key: "grpc-access-logger",
						path: "practical-guides/grpc/access-logger",
					},
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
]

const labels: Record<Locale, Record<string, string>> = {
	en: {
		"first-steps": "Getting Started",
		"intro": "What is Sword?",
		"getting-started": "Getting Started",
		"file-structure": "File Structure",

		"fundamental-concepts": "Fundamentals",
		"application-types": "Application Types",
		"application": "Application",
		"configuration": "Configuration",
		"modules": "Modules",
		"controllers": "Controllers",
		"dependency-injection": "Dependency Injection",
		"interceptors": "Interceptors",
		"error-handling": "Error Handling",

		"practical-guides": "Practical Guides",
		"web": "Web",
		"web-configuration": "Configuration",
		"web-controllers": "Controllers",
		"web-request-flow": "Request Flow",
		"web-request-structure": "Request Structure",
		"web-data-validation": "Data Validation",
		"web-response-handling": "Response Handling",
		"web-error-handling": "Error Handling",
		"web-interceptors": "Interceptors",
		"web-streaming": "Streaming",
		"web-openapi": "OpenAPI & Swagger UI",
		"web-access-logger": "Access Logger",
		"socketio": "Socket.IO",
		"socketio-configuration": "Configuration",
		"socketio-controllers": "Controllers",
		"socketio-event-handling": "Event Handling",
		"socketio-data-validation": "Data Validation",
		"socketio-acknowledgements": "Acknowledgements",
		"socketio-interceptors": "Interceptors",
		"grpc": "gRPC",
		"grpc-configuration": "Configuration",
		"grpc-controllers": "Controllers",
		"grpc-tonic-fundamentals": "Tonic Fundamentals",
		"grpc-api-reference": "gRPC API Reference",
		"grpc-proto-files": ".proto files",
		"grpc-compiling-protos": "Compiling Protos",
		"grpc-errors": "gRPC Errors",
		"grpc-interceptors": "Interceptors",
		"grpc-service-inspection": "Service Inspection with grpcurl",
		"grpc-access-logger": "Access Logger",

		"complements": "Complements",
		"tracing": "Tracing & Logging",
		"auto-layers": "Built-in Tower Layers",
		"hot-reload": "Watch Mode & Hot Reload",
		"sword-cli": "Sword CLI",
	},
	es: {
		"first-steps": "Primeros pasos",
		"intro": "¿Qué es Sword?",
		"getting-started": "Iniciando",
		"file-structure": "Estructura de archivos",

		"fundamental-concepts": "Fundamentos",
		"application-types": "Tipos de aplicación",
		"application": "Aplicación",
		"configuration": "Configuración",
		"modules": "Módulos",
		"controllers": "Controladores",
		"dependency-injection": "Inyección de dependencias",
		"interceptors": "Interceptores",
		"error-handling": "Manejo de errores",

		"practical-guides": "Guías prácticas",
		"web": "Web",
		"web-configuration": "Configuración",
		"web-controllers": "Controladores",
		"web-request-flow": "El flujo de una solicitud",
		"web-request-structure": "Estructura de Request",
		"web-data-validation": "Validación de datos",
		"web-response-handling": "Manejo de respuestas",
		"web-error-handling": "Manejo de errores",
		"web-interceptors": "Interceptores",
		"web-streaming": "Streaming",
		"web-openapi": "OpenAPI y Swagger UI",
		"web-access-logger": "Access Logger",
		"socketio": "Socket.IO",
		"socketio-configuration": "Configuración",
		"socketio-controllers": "Controladores",
		"socketio-event-handling": "Manejo de eventos",
		"socketio-data-validation": "Validación de datos",
		"socketio-acknowledgements": "Acknowledgements",
		"socketio-interceptors": "Interceptores",
		"grpc": "gRPC",
		"grpc-configuration": "Configuración",
		"grpc-controllers": "Controladores",
		"grpc-tonic-fundamentals": "Fundamentos de Tonic",
		"grpc-api-reference": "API Reference gRPC",
		"grpc-proto-files": "Ficheros .proto",
		"grpc-compiling-protos": "Compilando protos",
		"grpc-errors": "Errores gRPC",
		"grpc-interceptors": "Interceptors",
		"grpc-service-inspection": "Inspección con grpcurl",
		"grpc-access-logger": "Access Logger",

		"complements": "Complementos",
		"tracing": "Tracing y logging",
		"auto-layers": "Layers de Tower integradas",
		"hot-reload": "Modo Watch y Hot Reload",
		"sword-cli": "CLI",
	},
}

function buildSidebar(locale: Locale): DefaultTheme.SidebarItem[] {
	const build = (nodes: PageNode[]): DefaultTheme.SidebarItem[] =>
		nodes.map((node) => ({
			text: labels[locale][node.key],
			...(node.path ? { link: `/${locale}/${node.path}` } : {}),
			...(node.items ? { items: build(node.items) } : {}),
			...(node.collapsed !== undefined ? { collapsed: node.collapsed } : {}),
		}))

	return build(sidebarTree)
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
		if (!page.startsWith("es/") && !page.startsWith("en/")) return page

		return page
			.split("/")
			.map((segment, index) => (index === 0 ? segment : segment.replace(/^\d+-/, "")))
			.join("/")
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
})
