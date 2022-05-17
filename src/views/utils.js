export function getCookie(name) {
  let dc = document.cookie;
  const array = dc.split(";");

  for (let el of array) if (el.match(name)) return true;

  return false;
}
