import { useState, useEffect } from 'react'
import { Socket, io } from 'socket.io-client'
import Peer from 'simple-peer'
import JoinScreen from './components/JoinScreen'
import UserList from './components/UserList'
import VideoCall from './components/VideoCall'

const SERVER_URL = 'https://21t555tz-5000.inc1.devtunnels.ms/'

type User = {
  username: string
  socketId: string
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [username, setUsername] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [callData, setCallData] = useState<any>(null)
  const [caller, setCaller] = useState<string>('')
  const [callerSignal, setCallerSignal] = useState<any>(null)
  const [callAccepted, setCallAccepted] = useState<boolean>(false)
  const [callEnded, setCallEnded] = useState<boolean>(false)
  console.log(callEnded)

  useEffect(() => {
    const newSocket = io(SERVER_URL)
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('activeUsers', (activeUsers: User[]) => {
      // Filter out current user
      setUsers(activeUsers.filter(user => user.username !== username))
    })

    socket.on('incomingCall', ({ from, signal, callerName }) => {
      setCaller(from)
      setCallerSignal(signal)
      setCallData({ from, callerName })
    })

    socket.on('callAccepted', ({ signal }) => {
      setCallAccepted(true)
      if (callData?.peer) {
        callData.peer.signal(signal)
      }
    })

    return () => {
      socket.off('activeUsers')
      socket.off('incomingCall')
      socket.off('callAccepted')
    }
  }, [socket, username, callData])

  const joinCall = (name: string) => {
    setUsername(name)
    if (socket) {
      socket.emit('register', name)
    }
  }

  const startCall = async (userId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(stream)
      
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream
      })

      peer.on('signal', (data) => {
        if (socket) {
          socket.emit('callUser', {
            to: userId,
            from: socket.id,
            signal: data
          })
        }
      })

      peer.on('stream', (remoteStream) => {
        // Handle remote stream
        if (document.getElementById('remote-video') as HTMLVideoElement) {
          (document.getElementById('remote-video') as HTMLVideoElement).srcObject = remoteStream
        }
      })

      setCallData({ peer, userId })
    } catch (err) {
      console.error('Error accessing media devices:', err)
    }
  }

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(stream)
      setCallAccepted(true)
      
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream
      })

      peer.on('signal', (data) => {
        if (socket) {
          socket.emit('answerCall', { to: caller, signal: data })
        }
      })

      peer.on('stream', (remoteStream) => {
        // Handle remote stream
        if (document.getElementById('remote-video') as HTMLVideoElement) {
          (document.getElementById('remote-video') as HTMLVideoElement).srcObject = remoteStream
        }
      })

      peer.signal(callerSignal)
      setCallData({ peer, userId: caller })
    } catch (err) {
      console.error('Error accessing media devices:', err)
    }
  }

  const endCall = () => {
    if (callData?.peer) {
      callData.peer.destroy()
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setCallAccepted(false)
    setCallEnded(true)
    setCallData(null)
    setStream(null)
    setCaller('')
    setCallerSignal(null)
  }

  if (!username) {
    return <JoinScreen onJoin={joinCall} />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
        {/* <Button>just check</Button> */}

      <h1 className="text-2xl font-bold mb-4">Video Call App 
      </h1>
      {stream ? (
        <VideoCall 
          stream={stream} 
          callAccepted={callAccepted}
          callData={callData}
          caller={callData?.callerName}
          onAnswer={answerCall}
          onEnd={endCall}
        />
      ) : (
        <UserList 
          users={users} 
          onCallUser={startCall} 
          incomingCall={callData}
          onAnswer={answerCall}
        />
      )}
    </div>
  )
}

export default App