
export const dres = [
  "Hypertonic sphincter",
"Lax sphincter",
"Normal sphincter tone",
"Internal opening"
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
