import { apiInitializer } from "discourse/lib/api";


async function applyHighlight(element) {
  const highlights = element.querySelectorAll(".d-wrap[wrap=highlight]");
  if (!highlights.length) {
    return;
  }
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  let icon = iconNode("highlighter");

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
  
  // add button to the menu dropdown
  // api.addToolbarPopupMenuOptionsCallback(() => {
  //  return {
  //    icon: "highlighter",
  //    label: "highlight_button_title",
  //    action: "highlightButton",
  //  };
  // });

  // add button to the toolbar
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "composer_highlight_button",
      group: "extras",
      icon: "highlighter",
      title: "highlight_button_title",
      perform: e => e.applySurround('[wrap=highlight]', '[/wrap]')
    });
  });

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyHighlight(elem, id);
    },
    { id: "wrap-highlight" }
  );
});
