/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChangeEvent, createRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BUCKET_URL = "s3://booklivebucket/uploads/";

interface FileInputProps {
  setImageToUpload: (imageToUpload: string) => void;
}

export default function FilInput({ setImageToUpload }: FileInputProps) {
  const [uploadingStatus, setUploadingStatus] = useState<string>();
  const fileRef = createRef<HTMLInputElement>();
  // const [uploadedFile, setUploadedFile] = useState<string>();
  // const [imageToUpload, setImageToUpload] = useState<string>();

  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files[0]?.name) return;
    const fileName = `${uuidv4()}_${e.target.files[0].name}`;
    void getPresignedUrl({ fileName }).then((signedUrl) => {
      void uploadToS3(e.target.files[0], signedUrl);
    });
  };
  const { mutateAsync: getPresignedUrl } = api.s3.getPresignedUrl.useMutation();

  const uploadToS3 = async (file: File | undefined, presignedUrl: string) => {
    if (!file || !presignedUrl) return;
    setUploadingStatus("uploading...");
    await axios
      .put(presignedUrl, file.slice(), {
        headers: { "Content-Type": file.type },
      })
      .then((response) => {
        if (response.status !== 200) {
          setUploadingStatus(
            "An error occurred while uploading the file, please try again."
          );
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const imgUrl = response.request?.responseURL?.split("?")[0];
        if (!imgUrl) {
          setUploadingStatus(
            "An error occurred while uploading the file, please try again."
          );
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
        <input className="file-selector-button hidden" ref={fileRef} type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => selectFile(e)} />
        <span className="cursor-pointer border-dashed border-2 border-purple-500" onClick={() => fileRef.current?.click()}>{ !uploadingStatus ? 'Set Profile Picture' : 'Change picture'}</span>
      </main>
    </div>
  );
}
