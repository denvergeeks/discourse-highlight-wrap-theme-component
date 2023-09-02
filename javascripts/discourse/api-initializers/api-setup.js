import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";
import I18n from "I18n";

async function applyHighlight(element) {
  const highlights = element.querySelectorAll(".d-wrap[wrap=highlight]");
  if (!highlights.length) {
    return;
  }
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  iconNode("paint-brush");

  const currentLocale = I18n.currentLocale();
  // I18n.translations[currentLocale].js.qrcode_button_title = I18n.t(themePrefix("composer_footnote_button_title"));
  // I18n.translations[currentLocale].js.composer.qrcode_button_text = I18n.t(themePrefix("composer_footnote_button_text"));
  I18n.translations[currentLocale].js.highlight_button_title = "Highlight Text";
  I18n.translations[currentLocale].js.composer.highlight_button_text = "Highlight Text";

  api.modifyClass("controller:composer", {
    pluginId: "highlight",

    actions: {
      highlightButton() {
        this.get("toolbarEvent").addText(
          "\n" + `[wrap=highlight]` + "\n[/wrap]\n"
        );
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      icon: "paint-brush",
      label: "highlight_button_title",
      action: "highlightButton",
    };
  });

  // add button rather than to the menu
  // api.onToolbarCreate((toolbar) => {
  //   toolbar.addButton({
  //     id: "composer_highlight",
  //     group: "extras",
  //     icon: "highlight",
  //     title: "highlight_button_text",
  //     perform: (e) => e.addText("\n" + `[wrap=highlight]` + "\n[/wrap]\n"),
  //   });
  // });

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyHighlight(elem, id);
    },
    { id: "discourse-highlight-wrap-theme-component" }
  );
});
