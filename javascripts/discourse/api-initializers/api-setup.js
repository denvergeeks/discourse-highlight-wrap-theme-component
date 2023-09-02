import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";
import I18n from "I18n";

async function applyQrcode(element) {
  const qrcodes = element.querySelectorAll(".d-wrap[data-wrap=qrcode]");
  if (!qrcodes.length) {
    return;
  }

  await loadScript(settings.theme_uploads_local.qrcode_js);

  qrcodes.forEach((qrcode) => {
    const qr = document.createElement("div");
    qr.classList.add("qrcode");
    const url = qrcode.getAttribute("data-url")
      ? qrcode.getAttribute("data-url")
      : window.location.href;
    /*eslint no-new: 0 */
    new window.QRCode(qr, url);
    let node = document.createTextNode(url);

    qrcode.appendChild(node);
    qrcode.append(qr);
  });
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  iconNode("qrcode");

  const currentLocale = I18n.currentLocale();
  // I18n.translations[currentLocale].js.qrcode_button_title = I18n.t(themePrefix("composer_footnote_button_title"));
  // I18n.translations[currentLocale].js.composer.qrcode_button_text = I18n.t(themePrefix("composer_footnote_button_text"));
  I18n.translations[currentLocale].js.qrcode_button_title = "Insert QR Code";
  I18n.translations[currentLocale].js.composer.qrcode_button_text =
    "Insert QR Code";

  api.modifyClass("controller:composer", {
    pluginId: "qrcode",

    actions: {
      qrcodeButton() {
        this.get("toolbarEvent").addText(
          "\n" + `[wrap=qrcode url=]` + "\n[/wrap]\n"
        );
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      icon: "qrcode",
      label: "qrcode_button_title",
      action: "qrcodeButton",
    };
  });

  // add button rather than to the menu
  // api.onToolbarCreate((toolbar) => {
  //   toolbar.addButton({
  //     id: "composer_qrcode",
  //     group: "extras",
  //     icon: "qrcode",
  //     title: "qrcode_button_text",
  //     perform: (e) => e.addText("\n" + `[wrap=qrcode url=]` + "\n[/wrap]\n"),
  //   });
  // });

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyQrcode(elem, id);
    },
    { id: "discourse-qrcode-theme-component" }
  );
});
