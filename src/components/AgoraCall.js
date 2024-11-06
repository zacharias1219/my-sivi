"use client";

import { useEffect, useState } from "react";
import Navbar from '@/components/navbar';
import { useUsers } from "@/context/UsersContext";
import { addModeratorBot, transcribeAudio, handleTranscription, getAllParticipants } from '@/components/bot';
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { generateResponse, textToSpeech } from "../pages/api/Whisper";
import { useWhisper } from '@chengsokdara/use-whisper'

function Call(props) {
  const client = typeof window !== 'undefined' ? useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  ) : null;

  return (
    client ? (
      <AgoraRTCProvider client={client}>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow p-4 space-y-4">
            <Audio channelName={props.channelName} AppID={props.appId} id={props.id} client={client} />
          </main>
          <div className="flex justify-center p-10">
            <nav className="bg-white rounded-xl shadow-2xl py-6 p-4 w-96">
              <ul className="flex md:flex-row flex-col justify-center gap-12">
              <li className="flex">
                  <MuteButton /> 
                </li>
                <li className="flex">
                  <a className="px-5 py-3 text-base font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 w-36" href="/home">
                    End Call
                  </a>
                </li>
              </ul>
            </nav>
            </div>
        </div>
      </AgoraRTCProvider>
    ) : null
  );
}

function Audio(props) {
  const { AppID, channelName, id, client } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { users, currentUser } = useUsers();
  usePublish([localMicrophoneTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: id,
  });
  const [question, setQuestion] = useState("Click on the button");

  useEffect(() => {
    if (remoteUsers.length > 1) {
      addModeratorBot(client, channelName, AppID);
    }
  }, [remoteUsers]);

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      audioTracks.forEach(track => {
        const mediaStreamTrack = track.getMediaStreamTrack();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = async (audioProcessingEvent) => {
          const inputBuffer = audioProcessingEvent.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          const transcription = await transcribeAudio(inputData);
          if (transcription) {
            handleTranscription(transcription);
          }
        };
      });
    }
  }, [audioTracks]);

  if (isLoadingMic)
    return (
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <h2 className="font-bold mb-2">Loading devices...</h2>
      </div>
    );

  const allParticipants = getAllParticipants(remoteUsers);

  const questionBank = [
    "What is your favorite hobby?",
    "What do you like to do in your free time?",
    "What is your favorite book?",
    "What is your favorite movie?",
    "What is your favorite type of music?",
    // Add more questions to the bank here
  ];

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    setQuestion(questionBank[randomIndex]);
  };

  return (
    <div className="space-y-4 bg-white p-16 rounded-lg shadow">

      <section className="pb-10 pt-6">
        <ul className="space-y-2 flex flex-col items-center md:flex-row gap-20 justify-center">
          <li className="flex items-center text-center rounded-2xl">
            <div className="w-40 h-40 bg-blue-500 rounded-full mr-2">
            {currentUser.profilePicture ? (
        <img
          src={currentUser.profilePicture}
          alt={currentUser.username}
          className="w-full h-full object-cover"
        />
      ) : (
        <p className="p-10">No profile picture available</p>
      )}
            </div>
            <span className="text-xl font-bold">You</span>
          </li>
          {
            allParticipants.map((user) => {
              const userDetail = users.find((u) => u._id === user.uid) || user;
              return (
                <li key={user.uid} className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mr-2">
                    {
                      userDetail.profilePicture ? (
                        <img src={userDetail.profilePicture} alt={userDetail.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {userDetail.username && userDetail.username.charAt(0).toUpperCase()} Not found
                        </div>
                      )
                    }
                  </div>
                  <span>{userDetail.username}</span>
                </li>
              );
            })
          }
        </ul>
      </section>
      <div className="flex flex-col justify-center items-center gap-y-5">
        <section className="bg-blue-900 p-4 rounded-2xl shadow">
        <div className="rounded-3xl bg-pri-base flex flex-row items-center justify-center p-4 text-17xl text-background">
            <b className="w-[320px] text-white text-2xl relative inline-block shrink-0">
              {question}
            </b>
          </div>
        </section>
        <section className="bg-blue-300 hover:bg-blue-400 w-50 px-4 rounded-2xl">
        <div onClick={generateQuestion} className="rounded-2xl bg-pri-10 flex flex-row items-center justify-center py-2 px-[17px] gap-2.5 text-lgi text-pri-90 hover:bg-pri-50 font-product-sans-medium">
            <div className="relative text-blue-600">Generate question</div>
            
          </div>
        </section>
        </div>
    </div>
  );
}

function MuteButton() {
  const {
    recording,
    transcript,
    transcribing,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_TOKEN,
  });
  
  const [micMuted, setMicMuted] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

  // Function to toggle mic and start/stop recording
  const toggleMic = () => {
    const newMutedState = !micMuted;
    if (newMutedState) {
      startRecording();
    } else {
      stopRecording();
    }
    setMicMuted(newMutedState);
    localMicrophoneTrack.setMuted(newMutedState);
  };

  // Function to handle the full TTS process
  const handleSpeechResponse = async () => {
    if (transcript.text) {
      const response = await generateResponse(transcript.text);
      if (response) {
        await textToSpeech(response);
      } else {
        console.error('Error generating response');
      }
    } else {
      console.error('No transcription text available');
    }
  };

  return (
    <div>
      <h1>{transcript.text || '[Transcription will go here]'}</h1>
      <button
        onClick={toggleMic}
        className={`px-5 py-3 text-base font-medium text-center rounded-lg w-36 
          ${micMuted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
      >
        {micMuted ? "Mute" : "Unmute"}
      </button>
      <button
        className="bg-blue-400 rounded-md p-1 mt-3"
        onClick={handleSpeechResponse}
      >
        Text to Speech
      </button>
    </div>
  );
}


export default Call;
