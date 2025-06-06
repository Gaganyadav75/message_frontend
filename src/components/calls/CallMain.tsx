import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconButton, Typography, Avatar } from "@mui/material";
import {
  ArrowBack,
  CallEnd,
  Mic,
  MicOff,
  VideoCall,
  Phone,
  Sms,
  ChangeCircle,
} from "@mui/icons-material";
import { subscribe, unsubscribe } from "../../handlers/reusable/Event";
import { AppDispatch, useAppSelector } from "../../redux/store";
import { ContactType, unReadUpdate, updateCurrent } from "../../redux/slice/chat/mainChats";
import { getFileUrl } from "../reusable/profileUrl";
import { useDispatch } from "react-redux";
import { useSocket } from "../../handlers/socket/SocketContext";
import { HandleAnswerType, HandleOfferType, setRemoteStateType, VideoSteamsType } from "./callType";

const PeerConfig = {
  iceServers: [
    // Reliable public STUN servers
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.relay.metered.ca:80" },

    // Metered TURN servers (well-maintained)
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "c00dbfd8928be52f696c5f95",
      credential: "+DqR8vqrCtRh+JR4",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "c00dbfd8928be52f696c5f95",
      credential: "+DqR8vqrCtRh+JR4",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "c00dbfd8928be52f696c5f95",
      credential: "+DqR8vqrCtRh+JR4",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "c00dbfd8928be52f696c5f95",
      credential: "+DqR8vqrCtRh+JR4",
    },

    // OpenRelay - community TURN
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    }
  ],
  iceTransportPolicy: "all"
} as RTCConfiguration;




function CallMain() {
  const [isCallActive, setIsCallActive] = useState<null|"incomming"|"outgoing"|"active">(null);
  const [fullSize, setFullSize] = useState(true);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const [remoteStreamState, setRemoteStreamState] = useState<setRemoteStateType>({
    audio: false,
    video: false,
  });

  const onCall = useRef<ContactType | null>(null);
  const [videoCall, setVideoCall] = useState<boolean>(false);

  const callFrom = useRef<ContactType | null>(null);

  const callTo = useRef<ContactType|null>(null)

  const newOffer = useRef<RTCSessionDescription | null>(null);
  const backavail = useRef<{back:boolean,avail:boolean}>({back:false,avail:false});


  const [busy, setBusy] = useState<boolean>(false);

  const peerConnection =
    useRef<RTCPeerConnection | null>(null);

  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSet = useRef<boolean>(false);

  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const DataChannel= useRef<RTCDataChannel | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const current = useAppSelector((state) => state.chats.current);

  const dispatch = useDispatch<AppDispatch>();

  const socket = useSocket();


const cleanupStreams = useCallback(() => {
     if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => track.stop());
      remoteStream.current = null;

    }
    setBusy(false);
    callTo.current = null;
    onCall.current = null;
    newOffer.current = null;
    setRemoteStreamState({ video: false, audio: false });
    iceCandidateQueue.current = []
    remoteDescriptionSet.current = false
   
      setIsCallActive(null);
      peerConnection.current?.close();
      peerConnection.current = null;
  }, [
    peerConnection,
    localStream,
    remoteStream,
    setIsCallActive,
  ]);

  const initiateCall = useCallback(
    async (e: CustomEvent) => {
      const video = e.detail.video;
      const to = e.detail.to;
      if (isCallActive) {
        alert("you are on call");
        return;
      }

      try {
      
        const stream = await navigator.mediaDevices.getUserMedia({
          video,
          audio: true
        });

        const connection = new RTCPeerConnection(PeerConfig);

        const dataChannel = connection.createDataChannel("sendChannel");

        connection.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit("ice-candidate", {
              from: {...user,chatId:to?.chatId},
              to: to,
              candidate: event.candidate,
            });
          }
        };

        stream
          .getTracks()
          .forEach((track) => connection.addTrack(track, stream));

        

        connection.ontrack = (event: RTCTrackEvent) => {
          const incomingStream = event.streams[0];
          if (incomingStream) {
            remoteStream.current = incomingStream;
          }

          incomingStream.getTracks().forEach((ele) => {
            if (ele.enabled) {
              if (ele.kind == "video") {
                setRemoteStreamState((prev: setRemoteStateType) => {
                  return { audio: prev.audio, video: true };
                });
              }
              if (ele.kind == "audio") {
                setRemoteStreamState((prev: setRemoteStateType) => {
                  return { audio: true, video: prev.video };
                });
              }
            }
          });
        };



        connection.onconnectionstatechange = () => {
          if (
            connection.connectionState === "disconnected" ||
            connection.connectionState === "failed" ||
            connection.connectionState === "closed"
          ) {
          
            socket?.emit("end-call", {chatId:to?.chatId,to:to});
            cleanupStreams()
            console.log("Connection lost ..........")
          }
        };

        dataChannel.onmessage = (e) => {
          setRemoteStreamState((prev) => {
            return { ...prev, ...JSON.parse(e.data) };
          });
        };

        dataChannel.onopen = () => console.log("Data channel open.");
        dataChannel.onclose = () => console.log("Data channel closed.");
        DataChannel.current = dataChannel;

        const offer = await connection.createOffer();
        connection.setLocalDescription(offer);

        socket?.emit("offer", {
          chatId: current?.chatId,
          from: user,
          to: current,
          offer,
          video,
        });

        localStream.current = stream;
        peerConnection.current = connection;
        iceCandidateQueue.current = []
        remoteDescriptionSet.current =false;
        callTo.current = to;
        setVideoCall(video?true:false)
        setIsCallActive("outgoing");

      } catch {
        setIsCallActive(null);
        alert("Connection error");
      }
    },
    [
      cleanupStreams,
      setIsCallActive,
      callTo,
      peerConnection,
      isCallActive,
      socket,
      current,
      user
    ],
  );

  const toggleVideo = useCallback(() => {
    if (localStream.current) {
      localStream.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
        setIsVideoEnabled((prev) => {
        if (DataChannel.current?.readyState == "open")
          DataChannel.current?.send(JSON.stringify({ video: !prev }));
        return !prev;
      });
    }
  }, [localStream, setIsVideoEnabled, DataChannel]);

  const changeCamera = useCallback(async () => {

    if (videoCall && backavail.current.avail && localStream.current && peerConnection.current) {
      // Stop current tracks
      localStream.current.getTracks().forEach(track => track.stop());
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoCall && {
            facingMode: !backavail.current.back ? "user" : "environment"  // Toggle camera
          },
          audio:isAudioEnabled,
        });
  
        // Replace tracks in peerConnection
        stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = isAudioEnabled));

        stream.getTracks().forEach(track => {
          const sender = peerConnection.current?.getSenders().find(s => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            peerConnection.current?.addTrack(track, stream);
          }
        });
        localStream.current = stream;
        backavail.current = {avail:true,back:!backavail.current.back};
      } catch (error) {
        console.error("Failed to switch camera:", error);
        alert("failed to switch camera");
      }
    }

  }, [backavail, localStream, peerConnection, videoCall,isAudioEnabled]);
  

  const toggleAudio = useCallback(() => {
    if (localStream.current) {
      localStream.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsAudioEnabled((prev) => {
        if (DataChannel.current?.readyState == "open")
          DataChannel.current?.send(JSON.stringify({ audio: !prev }));
        return !prev;
      });
    }
  }, [localStream, setIsAudioEnabled, DataChannel]);

  const handleBackClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      setFullSize(false);
    },
    [setFullSize],
  );



  const EndCall = useCallback(() => {

    socket?.emit("end-call", {chatId:onCall.current?.chatId || callTo.current?.chatId||callFrom.current?.chatId,to:onCall.current||callTo.current||callFrom.current});

    cleanupStreams()

  }, [
    socket,
    cleanupStreams
  ]);

  



  const handleAcceptOffer = useCallback(async () => {
    if (!newOffer.current || !callFrom.current) return;

    try {
     
      const connection = new RTCPeerConnection(PeerConfig);

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("ice-candidate", {
            from: user,
            to: callFrom.current,
            candidate: event.candidate,
          });
        }
      };


      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoCall,
        audio: true
      });
      stream.getTracks().forEach((track) => connection.addTrack(track, stream));


      connection.ontrack = (event: RTCTrackEvent) => {
        const incomingStream = event.streams[0];
        if (incomingStream) {
          remoteStream.current =incomingStream;
        }

        incomingStream.getTracks().forEach((ele) => {
          if (ele.enabled) {
            if (ele.kind == "video") {
              setRemoteStreamState((prev: setRemoteStateType) => {
                return { audio: prev.audio, video: true };
              });
            }
            if (ele.kind == "audio") {
              setRemoteStreamState((prev: setRemoteStateType) => {
                return { audio: true, video: prev.video };
              });
            }
          }
        });
      };


      connection.onconnectionstatechange = async () => {
      
        if (connection.connectionState === "connected") {        
          console.log("WebRTC connection established.");
        }

        if (
          connection.connectionState === "disconnected" ||
          connection.connectionState === "failed" ||
          connection.connectionState === "closed"
        ) {

          socket?.emit("end-call", {chatId:onCall.current?.chatId || callFrom.current?.chatId,to:onCall.current||callTo.current});
 
          dispatch(unReadUpdate({chatId:callFrom.current?.chatId,unreadCount:0}))

          cleanupStreams()
     
        }
      };

      await connection.setRemoteDescription(
        new RTCSessionDescription(newOffer.current),
      );
      for (const candidate of iceCandidateQueue.current) {
          await connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
      iceCandidateQueue.current =[];

      remoteDescriptionSet.current = true;

      connection.addEventListener("datachannel", (e) => {
        const dataChannel = e.channel;
        dataChannel.onmessage = (e) => {
          setRemoteStreamState((prev) => {
            return { ...prev, ...JSON.parse(e.data) };
          });
        };
        dataChannel.onopen = () => console.log("Data channel open.");
        dataChannel.onclose = () => console.log("Data channel closed.");
        DataChannel.current = dataChannel;
      });

      const answer = await connection.createAnswer();

      await connection.setLocalDescription(answer);
      
      socket?.emit("answer", {
        chatId: callFrom.current?.chatId,
        from: user,
        to: callFrom.current,
        answer,
      });

      peerConnection.current = connection;
      iceCandidateQueue.current = [];
      localStream.current = stream;
      setIsCallActive("active");
      onCall.current = callFrom.current;
      
    } catch (err) {
      EndCall();
      callFrom.current = null;
      newOffer.current = null;
      iceCandidateQueue.current = [];
      console.log(err);
    }
  }, [
    cleanupStreams,
    peerConnection,
    user,
    videoCall,
    socket,
    setIsCallActive,
    EndCall,
    dispatch
  ]);


  const handleOffer = useCallback(
    ({ from, chatId, offer, video }: HandleOfferType) => {
      if (isCallActive) {
        socket?.emit("answer", {
          from: user,
          chatId,
          answer: null,
          message: "on another call",
        });
        return;
      }
      setVideoCall(video);
      callFrom.current = from;
      newOffer.current = offer;
      setIsCallActive("incomming")
    },
    [isCallActive, socket, user]
  );
  
  
  const handleAnswer = useCallback(
    async ({ from, answer }: HandleAnswerType) => {
      try {
        if (peerConnection.current && answer) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          )
          for (const candidate of iceCandidateQueue.current) {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          remoteDescriptionSet.current = false;
          onCall.current = from;
  
          newOffer.current = null;
          iceCandidateQueue.current = [];
          setBusy(false);
          setIsCallActive("active");
        } else {
          setBusy(true);
        }
      } catch{
        // silent catch
      }

    },
    []
  );

  
  const handleICECandidate = useCallback(
    async({ candidate }:{candidate:RTCIceCandidate}) => {
       console.log('ICE Candidate:', candidate);
      if (!peerConnection.current || !candidate) return;

      if (remoteDescriptionSet.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      } else {
        iceCandidateQueue.current.push(candidate);
      }
    },
    []
  );
  
  const handleEndCall = useCallback(
    ({ chatId }: { chatId: string }) => {
      if ((onCall.current && chatId === onCall.current?.chatId) ||
          (callTo && chatId === callTo.current?.chatId) ||
          (!isCallActive && callFrom.current && callFrom.current.chatId === chatId)) {
          cleanupStreams();
      }
    },
    [isCallActive,cleanupStreams]
  );
  
  useEffect(() => {
    if (!socket) return;
  
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleICECandidate);
    socket.on("end-call", handleEndCall);
  
    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleICECandidate);
      socket.off("end-call", handleEndCall);
      setIsAudioEnabled(true);
      setIsVideoEnabled(true);
    };
  }, [isCallActive,socket, handleOffer, handleAnswer, handleICECandidate, handleEndCall]);
  


  useEffect(() => {
    subscribe("initiate-call", initiateCall);
    return () => {
      unsubscribe("initiate-call", initiateCall);
    };
  }, [isCallActive,initiateCall, current?._id]);


  
  useEffect(()=>{
    async function check() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back"));
      if(backCamera){
        backavail.current = {avail:true,back:false};
      }
    }
    check();
  },[])



  const screenClicked = useCallback(() => {
    setFullSize(true);
  }, [setFullSize]);





  if (!isCallActive ) {
    return null;
  }


  if (isCallActive=="incomming" ) {
    
    if(!newOffer.current || !callFrom.current){
      return null;
    }
  
    return (
      <div
        className={`absolute top-0 flex flex-col justify-center items-center right-0 backdrop-blur-2xl  z-[100] overflow-hidden  p-8 w-fit`}
      >
    
      <audio src={"/call-audio.mp3"} muted={false} loop autoPlay className='call-audio w-0 h-0 hidden top-0 left-0'/>
    

        {/* Call Info */}
        <div className="flex flex-col items-center gap-2">
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="John Doe"
            src={getFileUrl(callFrom.current?.profile, "profiles")}
          />
          <Typography variant="h5">{callFrom.current?.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            Calling ...
          </Typography>
        </div>

        <div
          className={`flex w-full z-50 mt-4 justify-center transition-all duration-300 delay-300 gap-5 `}
        >
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              EndCall();
            }}
          >
            <CallEnd />
          </IconButton>
          <IconButton
            sx={{ bgcolor: "black" }}
            className="animate-pulse bg-black"
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              handleAcceptOffer();
            }}
          >
            <Phone />
          </IconButton>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(updateCurrent(callFrom.current));
              EndCall();
            }}
          >
            <Sms />
          </IconButton>
          
        </div>
      </div>
    );
  }


  return (
    <div
      className={`absolute top-0 right-0 backdrop-blur-md z-[100] overflow-hidden ${
        fullSize ? "h-full w-full" : "aspect-[1/1] w-[30%]"
      }`}
    >

      <div
        className={`relative flex flex-col h-full w-full justify-center p-2 group bg-transparent`}
        onClick={screenClicked}
      >
        {videoCall ? 
          <VideoStreams
            status={remoteStreamState}
            isVideoEnabled={isVideoEnabled}
            localStream={localStream.current}
            remoteVideoStream={remoteStream.current}
          />
         : 
         remoteStream.current &&  <AudioStream remoteAudioStream={remoteStream.current} />
        }

        {/* Header */}
        <div
          className={`${
            !fullSize ? "hidden" : "flex"
          } absolute top-0 left-0 justify-between p-4 w-full text-center  `}
        >
          <IconButton edge="start" color="inherit" onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
        </div>

        {/* Call Info */}
        <div
          className={`flex-col items-center z-50 py-4 ${
            remoteStreamState.video ? "hidden" : "flex"
          }`}
        >
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="John Doe"
            src={getFileUrl(onCall.current?.profile||callTo.current?.profile,'profiles')}
          />
          <Typography variant="h5" sx={{ mt: 2 }}>
            {onCall.current?.username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isCallActive && remoteStream
              ? "Connected"
              :busy?"Busy on another call"
              : onCall.current?.isOnline
              ? "Ringing..."
              : "Calling"}
            {!remoteStream ?
            <audio  src="/out-call-audio.mp3" muted={false} loop autoPlay className=' w-0 h-0 hidden top-0 left-0'/>:""
            }
          </Typography>
        </div>

        {/* Buttons */}
        <div
          className={`flex w-full absolute z-50 mt-4 justify-center transition-all -bottom-10 group-hover:bottom-4 duration-300 delay-300 ${
            !fullSize ? " gap-2 " : " gap-10"
          }`}
        >
          {videoCall && backavail.current.avail &&
            <IconButton
              color={!isVideoEnabled ? "secondary" : "default"}
              onClick={changeCamera}
            >
              <ChangeCircle />
            </IconButton>
          }
          <IconButton
            color={!isAudioEnabled ? "secondary" : "default"}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </IconButton>


          {videoCall && (
            <IconButton
              color={!isVideoEnabled ? "secondary" : "default"}
              onClick={toggleVideo}
            >
              <VideoCall />
            </IconButton>
          )}

          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              EndCall();
            }}
          >
            <CallEnd />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default CallMain;

const VideoStreams = ({
  isVideoEnabled,
  status,
  localStream,
  remoteVideoStream,
}:VideoSteamsType ) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isVideoEnabled,localStream]);

  useEffect(() => {
     if (remoteVideoRef.current && remoteVideoStream) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  }, [status,remoteVideoStream]);

  return (
    <>
      <div
        className={`absolute bottom-0 right-0 max-w-1/3 h-1/3 flex center bg-transparent   `}
      >
        {isVideoEnabled?
         <video
         id="videoelement2"
         ref={localVideoRef}
         autoPlay
         muted
         playsInline
         className={`scale-x-[-1] z-50`}
          ></video>
       :
        <div className="absolute bottom-5 right-5 flex items-center justify-center text-white bg-transparent">
            <Avatar className="z-50" alt='profile' src={getFileUrl(user?.profile,'profiles')}/>
        </div>
      }
      </div>

      {/* <div  className={``}> */}

      <video
        id="videoelement"
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute top-0 left-0 w-full h-full scale-x-[-1] ${
          !status.video ? "hidden" : "block"
        }`}
      ></video>
      {/* </div> */}
    </>
  );
};

const AudioStream = ({ remoteAudioStream }: {remoteAudioStream:MediaStream}) => {
  const remoteAudioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteAudioRef.current && remoteAudioStream) {
      remoteAudioRef.current.srcObject = remoteAudioStream;
    }
  }, [remoteAudioRef, remoteAudioStream]);

  return (
    <>
      <audio
        id="videoelement2"
        ref={remoteAudioRef}
        autoPlay
        playsInline
        className={`w-0 h-0 z-0`}
      ></audio>
    </>
  );
};
