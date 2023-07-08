/* eslint-disable @next/next/no-img-element */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  import { ChangeEvent, useState } from "react";
  import { signIn, signOut, useSession } from "next-auth/react";
  import { api } from "~/utils/api";
  import axios from "axios";
  import { v4 as uuidv4 } from 'uuid';

  const BUCKET_URL = "s3://booklivebucket/uploads/";

  interface FileInputProps {
    setImageToUpload: (imageToUpload: string) => void;
  }

  export default function FilInput({ setImageToUpload }: FileInputProps) {
    const [uploadingStatus, setUploadingStatus] = useState<string>();
    // const [uploadedFile, setUploadedFile] = useState<string>();
    // const [imageToUpload, setImageToUpload] = useState<string>();

    const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e?.target?.files[0]?.name) return;
      const fileName = `${uuidv4()}_${e.target.files[0].name}`;
      void getPresignedUrl({ fileName }).then((signedUrl) => {
        void uploadToS3(e.target.files[0], signedUrl);
      });
    };
    const { mutateAsync: getPresignedUrl } =
      api.s3.getPresignedUrl.useMutation();
   
    const uploadToS3 = async (file: File | undefined, presignedUrl: string) => {
      if (!file || !presignedUrl) return;
      setUploadingStatus("uploading...");
      await axios
      .put(presignedUrl, file.slice(), {
        headers: { "Content-Type": file.type },
      })
      .then((response) => {
        if (response.status !== 200) {
          setUploadingStatus("An error occurred while uploading the file, please try again.");
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const imgUrl = response.request?.responseURL?.split("?")[0];
        if (!imgUrl) {
          setUploadingStatus("An error occurred while uploading the file, please try again.");
          return;
        }
        setUploadingStatus("uploaded");
        setImageToUpload(imgUrl);
        console.log("Successfully uploaded ", file.name);
      })
      .catch((err) => console.error(err));
    };

    return (
      <div>
        <main>
          <label>Profile image</label>
          <input
            className="block inline-block w-full cursor-pointer cursor-pointer rounded-lg rounded-md border bg-white/10 p-2 text-white hover:bg-white/20 py-2 px-4 text-sm text-white text-bold focus:outline-none"
            type="file"
            onChange={(e) => selectFile(e)}
          />
          {uploadingStatus && (
            <span>
              <svg
                className="ml-2 -mr-0.5 h-4 w-4 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.293 11.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l8 8a1 1 0 0 1-1.414 1.414l-7.293-7.293-3.293 3.293a1 1 0 0 1-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          )}
        </main>
      </div>
    );
  }