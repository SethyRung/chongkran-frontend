import type { UploadResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event, false);

  if (!body) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "File is required",
      },
      null,
    );
  }

  try {
    return proxy<UploadResponse>(event, "/upload", {
      method: "post",
      body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch {
    return createResponse<UploadResponse>(
      {
        code: ApiResponseCode.InternalError,
        message: "An error occurred while processing the request.",
      },
      null as any,
    );
  }
});
