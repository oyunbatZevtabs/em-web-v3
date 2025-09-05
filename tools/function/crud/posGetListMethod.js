import posUilchilgee from "services/posUilchilgee";
function posGetListMethod(modelName, token, data) {
  return posUilchilgee(token).get(`/${modelName}`, { params: data });
}

export default posGetListMethod;
