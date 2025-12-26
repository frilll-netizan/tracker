import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, Home, Library, Heart, PlusSquare, Repeat, Shuffle } from 'lucide-react';

// Database Lagu (Mock Data)
const ALL_SONGS = [
  { id: 1, title: "Sial", artist: "Mahalini", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Jiwa Yang Bersedih", artist: "Ghea Indrawari", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Tak Segampang Itu", artist: "Anggi Marito", cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, title: "Rayuan Perempuan Gila", artist: "Nadin Amizah", cover: "https://images.unsplash.com/photo-1514525253361-bee8718a34a1?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5, title: "Penjaga Hati", artist: "Nadhif Basalamah", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 6, title: "Gajah", artist: "Tulus", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
];

export default function SpotifyClone() {
  // States
  const [songs, setSongs] = useState(ALL_SONGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState(ALL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef(new Audio(currentTrack.url));

  // Fungsi Pencarian
  useEffect(() => {
    const filtered = ALL_SONGS.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSongs(filtered);
  }, [searchQuery]);

  // Musik Logic
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  const playSong = (track) => {
    audioRef.current.pause();
    audioRef.current = new Audio(track.url);
    audioRef.current.volume = volume;
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black flex flex-col p-2 space-y-2 hidden md:flex">
        <div className="bg-[#121212] rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-4 text-gray-400 hover:text-white cursor-pointer transition">
            <Home size={24} />
            <span className="font-bold">Home</span>
          </div>
          <div className="flex items-center space-x-4 text-white cursor-pointer transition">
            <Search size={24} />
            <span className="font-bold">Search</span>
          </div>
        </div>

        <div className="bg-[#121212] rounded-lg p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between text-gray-400 mb-6">
            <div className="flex items-center space-x-2">
              <Library size={24} />
              <span className="font-bold">Your Library</span>
            </div>
            <PlusSquare size={20} className="hover:text-white cursor-pointer" />
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#242424] p-4 rounded-lg">
              <p className="font-bold text-sm mb-2">Create your first playlist</p>
              <p className="text-xs text-gray-400 mb-4">It's easy, we'll help you</p>
              <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full">Create playlist</button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] m-2 ml-0 rounded-lg overflow-y-auto pb-32">
        
        {/* HEADER / SEARCH BAR */}
        <header className="sticky top-0 bg-[#121212]/80 backdrop-blur-md p-4 flex items-center z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="What do you want to listen to?" 
              className="w-full bg-[#242424] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-white outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <section className="p-6">
          <h2 className="text-2xl font-bold mb-6 italic">
            {searchQuery ? `Results for "${searchQuery}"` : "Recently Played"}
          </h2>
          
          {/* GRID LAGU */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs.length > 0 ? songs.map((track) => (
              <div 
                key={track.id} 
                className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition duration-300 cursor-pointer group relative"
                onClick={() => playSong(track)}
              >
                <div className="relative mb-4">
                  <img src={track.cover} alt={track.title} className="w-full aspect-square object-cover rounded shadow-lg" />
                  {/* Play Button Overlay ala Spotify */}
                  <div className="absolute bottom-2 right-2 bg-[#1db954] p-3 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Play fill="black" className="text-black w-6 h-6 ml-0.5" />
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate mb-1">{track.title}</h3>
                <p className="text-gray-400 text-xs truncate">{track.artist}</p>
              </div>
            )) : (
              <p className="text-gray-400 col-span-full">No songs found...</p>
            )}
          </div>
        </section>
      </main>

      {/* PLAYER BAR */}
      <footer className="fixed bottom-0 w-full h-24 bg-black border-t border-white/5 px-4 flex items-center justify-between z-20">
        
        {/* Track Info */}
        <div className="flex items-center space-x-4 w-[30%]">
          <img src={currentTrack.cover} className="w-14 h-14 rounded shadow-lg" alt="Current" />
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate hover:underline cursor-pointer">{currentTrack.title}</h4>
            <p className="text-gray-400 text-[11px] truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
          </div>
          <Heart size={18} className="text-[#1db954] cursor-pointer ml-2" />
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center max-w-[40%] w-full">
          <div className="flex items-center space-x-6 mb-2">
            <Shuffle size={18} className="text-gray-400 hover:text-white cursor-pointer" />
            <SkipBack size={22} className="text-gray-300 hover:text-white fill-current cursor-pointer" />
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white p-2 rounded-full hover:scale-105 transition active:scale-95"
            >
              {isPlaying ? <Pause fill="black" className="text-black" size={24}/> : <Play fill="black" className="text-black" size={24}/>}
            </button>
            <SkipForward size={22} className="text-gray-300 hover:text-white fill-current cursor-pointer" />
            <Repeat size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
          
          <div className="w-full flex items-center space-x-2">
            <span className="text-[10px] text-gray-400">0:00</span>
            <input 
              type="range" 
              className="flex-1 accent-[#1db954] h-1 hover:h-1.5 cursor-pointer appearance-none bg-gray-600 rounded-lg" 
              value={progress}
              onChange={handleSeek}
            />
            <span className="text-[10px] text-gray-400">3:45</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-end space-x-3 w-[30%]">
          <Volume2 size={18} className="text-gray-400" />
          <input 
            type="range" 
            min="0" max="1" step="0.01"
            className="w-24 accent-[#1db954] h-1 cursor-pointer" 
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              audioRef.current.volume = e.target.value;
            }}
          />
        </div>
      </footer>
    </div>
  );
      }
