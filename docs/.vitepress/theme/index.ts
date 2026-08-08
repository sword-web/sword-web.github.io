import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "./fonts.css";
import "./style.css";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {});
    },
    enhanceApp({ app, router, siteData }) {},
} satisfies Theme;
