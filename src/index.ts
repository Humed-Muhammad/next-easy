import nextConnect from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

interface MulterConfig {
  des?: string;
  fileName?: string;
  storage?: "diskStorage" | "memoryStorage";
  uploadKey?: string;
}
interface INextFileUploader {
  multerConfig?: MulterConfig;
  middlewares?: any[];
}

export const nextFileUploader = (data?: INextFileUploader) => {
  const upload = multer({
    storage: multer[`${data?.multerConfig?.storage}`]({
      destination: data?.multerConfig?.des || "./public/uploads",
      // @ts-ignore
      filename: (_req, file, cb) =>
        cb(null, data?.multerConfig?.fileName || file.originalname),
    }),
  });

  const apiRoute = nextConnect({
    onError(error, _req: NextApiRequest, res: NextApiResponse) {
      res
        .status(501)
        .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(upload.array(data?.multerConfig?.uploadKey || "theFiles"));

  data?.middlewares?.map((item) => apiRoute.use(item));

  const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };
  return { apiRoute, config };
};
