import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "./fonts.css";
import "./style.css";
import ApiSection from "./components/ApiSection.vue";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {});
    },
    enhanceApp({ app }) {
        app.component("ApiSection", ApiSection);
    },
} satisfies Theme;
