import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef } from "react";
import FileInput from "./components/FileInput";


import { api } from "~/utils/api";

const SignUp: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC signup page" });

  return (
    <>
      <div className="flex max-w-xl flex-col gap-2 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
        <h3 className="text-3xl font-bold text-center">
          Sign up as a →
        </h3>
        <select
            className="w-full bg-transparent cursor-pointer text-white text-center font-bold pl-4 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:border-purple-500 focus:ring-0 border border-gray-300"
            name="userType"
            id="userType"
          >
            <option value="band">Band</option>
            <option value="musician">Musician</option>
            <option value="venueOwner">Venue Owner</option>
          </select>
        <div className="text-lg">
          <MusicianSignupForm />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-white">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <AuthShowcase />
      </div>
    </>
  );
};

export default SignUp;

const MusicianSignupForm: React.FC = () => {
  const skillLevelDisplay = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  function imageSrcCallback(imageSrc: string | null): void {
    console.log('imageSrc', imageSrc);
    setProfileImage(imageSrc);
  }
  function updateSkillDisplay(event: React.ChangeEvent<HTMLInputElement>): void {
    console.log('event', event.currentTarget.value);
    if (skillLevelDisplay.current)
      skillLevelDisplay.current.value = event.currentTarget.value;

  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    // console.log('event', event);
    const form = new FormData(event.currentTarget);
    const displayName = form.get('displayName')?.toString();
    const instrument = form.get('instrument')?.toString();
    const bio = form.get('bio')?.toString();
    const zipCode = form.get('zipCode')?.toString();
    const skillLevel = form.get('skillLevel') as number;
    console.log(displayName, instrument, bio, profileImage);
    // const user = await api.user.signup.mutateAsync({
    //   displayName,
    //   primaryInstrument: instrument || '',
    //   bio,
    //   profileImage,
    //   zipCode,
    //   skillLevel,
    // });

    // console.log('user', user);
  }
  
  return (<form onSubmit={handleSubmit} className="flex flex-col gap-2">
  <div className="flex flex-col gap-2">
    <FileInput setImageToUpload={imageSrcCallback}/>
    {profileImage && (
      <img
        src={profileImage}
        alt="Selected Image"
        width={300}
        height={200}
        className="rounded-lg object-cover mx-auto justify-self-center"
      />
    )}
    <label htmlFor="displayName">Display Name</label>
    <input className="text-black p-2" type="text" name="displayName" id="displayName" placeholder="Display Name" /> {/* displayName */}  {/* Instrument */} {/* bio */}

    <label htmlFor="instrument">Instrument</label>
    <input className="text-black p-2" type="text" name="instrument" id="instrument" />
    
    <label htmlFor="skillLevel">Skill Level</label>
    <input className="text-black p-2" type="range" name="skillLevel" id="skillLevel" min={0} max={10} defaultValue={5} onInput={updateSkillDisplay} />
    <input className="text-black p-2" disabled={true} type="number" name="skillLevelDisplay" ref={skillLevelDisplay} defaultValue={5} id="skillLevelDisplay"/>

    <label htmlFor="bio">Bio/Musical Influences</label>
    <input className="text-black p-2" type="text" name="bio" id="bio" />

    <label htmlFor="zipcode">Zipcode</label>
    <input className="text-black p-2" type="text" name="zipcode" id="zipcode" />
    </div>
    {/* submit button */}
    <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Submit</button>
  </form> );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
