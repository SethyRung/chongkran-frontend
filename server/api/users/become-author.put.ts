export default defineEventHandler(async (event) => {
  return proxy<string>(event, "/users/become-author", {
    method: "put",
  });
});
