/** Return a shallow copy of obj without the given key. */
export const omitKey = (obj, key) => {
  const { [key]: _ignored, ...rest } = obj;
  return rest;
};
