export function onloadCKEditor({ ClassicEditor }, el) {
  ClassicEditor.create(el, {
    licenseKey: "",
  })
    .then((editor) => {
      window.editor = editor;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function convertHTMLDocumentToString(el) {
  const doctype = "<!DOCTYPE html>";
  const newDoc = document.createElement("html");
  const head = document.createElement("head");
  const body = document.createElement("body");

  newDoc.appendChild(head);
  body.innerHTML = el;
  newDoc.appendChild(body);

  return doctype + newDoc.outerHTML;
}
