import posUilchilgee from "services/posUilchilgee";
function posUpdateMethod(modelName, token, data) {
  return posUilchilgee(token).put(`/${modelName}/${data?._id}`, data);
}

export default posUpdateMethod;
