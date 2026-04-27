export default defineEventHandler(async (event) => {
  return proxy<string>(event, "/shopping-lists", {
    method: "delete",
  });
});
