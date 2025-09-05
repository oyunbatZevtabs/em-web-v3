import posUilchilgee from "services/posUilchilgee";

function deleteMethod(modelName, token, id) {
  return posUilchilgee(token).delete(`/${modelName}/${id}`);
}

export default deleteMethod;
