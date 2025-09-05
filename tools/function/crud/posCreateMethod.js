import posUilchilgee from "services/posUilchilgee";
function posCreateMethod(modelName, token, data) {
  return posUilchilgee(token).post(`/${modelName}`, data);
}

export default posCreateMethod;
