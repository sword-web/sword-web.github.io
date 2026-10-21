import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme-without-fonts"
import "./fonts.css"
import "./style.css"
import ApiSection from "./components/ApiSection.vue"
import DependencyInjectionDiagram from "./components/DependencyInjectionDiagram.vue"
import ControllersDiagram from "./components/ControllersDiagram.vue"

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {})
	},
	enhanceApp({ app }) {
		app.component("ApiSection", ApiSection)
		app.component("DependencyInjectionDiagram", DependencyInjectionDiagram)
		app.component("ControllersDiagram", ControllersDiagram)
	},
} satisfies Theme
