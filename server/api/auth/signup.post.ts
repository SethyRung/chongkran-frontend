export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return proxy<string>(event, "/auth/signup", {
    method: "post",
    body,
  });
});
