export default function isRegister(v) {
  return (
    !!v && v.match(/[А-ЯӨҮ][А-ЯӨҮ][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/)
  );
}
