import React, { useState, useEffect } from 'react';
import './VideoQueue.css';  // Make sure the path is correct
import io from 'socket.io-client';

const VideoQueue = () => {
  const [queue, setQueue] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.io server when the component mounts
    const newSocket = io('http://localhost:5000'); // Update with your backend URL
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Listen for video queue updates from the server
    if (socket) {
      socket.on('videoQueueUpdate', (updatedQueue) => {
        setQueue(updatedQueue);
      });

      // Listen for the currently playing video from the server
      socket.on('currentVideo', (video) => {
        setCurrentVideo(video);
      });
    }
  }, [socket]);

  const handleUploadVideo = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Emit the uploaded video to the server
      socket.emit('uploadVideo', file.name);

      // Update the local state
      setQueue([...queue, file.name]);
    }
  };

  const handlePlayNextVideo = () => {
    // Emit to the server to play the next video in the queue
    socket.emit('playNextVideo');
  };

  return (
    <div>
      <h2>Video Queue</h2>
      <div>
        {/* Display the current playing video */}
        {currentVideo && <video controls src={`uploads/${currentVideo}`} />}
      </div>
      <div>
        {/* Button to upload a new video */}
        <input type="file" accept="video/*" onChange={handleUploadVideo} />
      </div>
      <div>
        {/* List of videos in the queue */}
        {queue.map((video, index) => (
          <div key={index}>{video}</div>
        ))}
      </div>
      <div>
        {/* Button to play the next video in the queue */}
        <button onClick={handlePlayNextVideo}>Play Next Video</button>
      </div>
    </div>
  );
};

export default VideoQueue;

/*import React, { useState } from 'react';

const VideoQueue = () => {
  const [queue, setQueue] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleUploadVideo = () => {
    // Implement video upload logic here
    // Add the uploaded video to the queue
  };

  const handlePlayNextVideo = () => {
    // Implement logic to play the next video in the queue
  };

  return (
    <div>
      <h2>Video Queue</h2>
      <div>
        {/* Display the current playing video *}
        {currentVideo && <video controls src={currentVideo} />}
      </div>
      <div>
        {/ Button to upload a new video *}
        <input type="file" accept="video/*" onChange={handleUploadVideo} />
      </div>
      <div>
        {* List of videos in the queue /}
        {queue.map((video, index) => (
          <div key={index}>{video}</div>
        ))}
      </div>
      <div>
        {* Button to play the next video in the queue *}
        <button onClick={handlePlayNextVideo}>Play Next Video</button>
      </div>
    </div>
  );
};

export default VideoQueue;*/
