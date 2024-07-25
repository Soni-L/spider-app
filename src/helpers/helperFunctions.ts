export function isValidURL(url: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}


const getElementTreeXPath = function (element) {
  var paths = [];

  // Use nodeName (instead of localName) so namespace prefix is included (if any).
  for (
    ;
    element && element.nodeType == Node.ELEMENT_NODE;
    element = element.parentNode
  ) {
    var index = 0;
    var hasFollowingSiblings = false;
    for (
      var sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      // Ignore document type declaration.
      if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;

      if (sibling.nodeName == element.nodeName) ++index;
    }

    for (
      var sibling = element.nextSibling;
      sibling && !hasFollowingSiblings;
      sibling = sibling.nextSibling
    ) {
      if (sibling.nodeName == element.nodeName) hasFollowingSiblings = true;
    }

    var tagName =
      (element.prefix ? element.prefix + ":" : "") + element.localName;
    var pathIndex =
      index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? "/" + paths.join("/") : null;
};

export function getXPath(element) {
  if (element && element.id) return '//*[@id="' + element.id + '"]';
  else return getElementTreeXPath(element);
}