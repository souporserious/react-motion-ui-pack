export default function specialAssign(a, b, reserved) {
  for (var x in b) {
    if (!b.hasOwnProperty(x) || reserved[x]) continue;
    a[x] = b[x]
  }
  return a
}
