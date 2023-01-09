export const getBufferFromBase64 = (encodedString: string) => {
  const [header, base64] = encodedString.split(",");
  const mime = header?.split(":")[1]?.split(";")[0]!;
  const extension = mime.split("/")[1]!;
  const buffer = Buffer.from(base64!, "base64");

  return { buffer, mime, extension };
};
