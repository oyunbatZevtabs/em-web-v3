import posUilchilgee from "services/posUilchilgee";
function posReadMethod(modelName, token, id) {
  return posUilchilgee(token).get(`/${modelName}/${id}`);
}

export default posReadMethod;
