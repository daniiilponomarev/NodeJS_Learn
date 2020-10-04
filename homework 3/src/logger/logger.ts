export const customLogger = (req: any, res: any, next: () => void) => {
  const currentDateTime = new Date();
  const formatted_date = `${currentDateTime.getFullYear()}-${
    currentDateTime.getMonth() + 1
  }-${currentDateTime.getDate()} ${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`;

  const [oldWrite, oldEnd] = [res.write, res.end];
  const chunks: Buffer[] = [];

  (res.write as unknown) = function (chunk: any) {
    chunks.push(Buffer.from(chunk));
    (oldWrite as Function).apply(res, arguments);
  };

  res.end = function (chunk: any) {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }
    const body = Buffer.concat(chunks).toString('utf8');

    const log = `[${formatted_date}] ${req.method}:${req.url}
request body: ${JSON.stringify(req.body)}
response status: ${res.statusCode}
response body: ${body}`;

    console.log(log);

    (oldEnd as Function).apply(res, arguments);
  };

  if (next) {
    next();
  }
};
