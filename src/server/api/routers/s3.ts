import { sign } from "crypto";
import { z } from "zod";
import S3 from "aws-sdk/clients/s3";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export const s3Router = createTRPCRouter({
  // signup: protectedProcedure.input(signupShape).mutation(({ input, ctx }) => {
  //   console.log("signup", input, ctx.session);
  // }),
  getPresignedUrl: publicProcedure
  .input(z.object({ fileName: z.string()}))
  .mutation(({ input }) => {
    if (!input || !input.fileName) {
      throw new Error("no input");
    }
    const { fileName } = input;
    console.log('getPresignedUrl', fileName);
    const presignedUrl = s3.getSignedUrl("putObject", {
      Bucket: `${env.BUCKET_NAME}/uploads`,
      Key: fileName,
      Expires: 300,
    });
    return presignedUrl;
  }),
  uploadS3: protectedProcedure
    .input(z.object({ file: z.any() }))
    .mutation(async ({ input }) => {
      console.log("input", input);
      try {
        const { file } = input || {};
        console.log(env.BUCKET_NAME);
        console.log(file);
        const fileParams = {
          Bucket: env.BUCKET_NAME,
          Key: file?.name,
          Expires: 600,
          ContentType: file.type,
        };
        console.log('fileParams', fileParams);
        const url = await s3.getSignedUrlPromise("putObject", fileParams);
        console.log('url', url);
        return url;
      } catch (err) {
        console.log("upload file error: ", err);
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
