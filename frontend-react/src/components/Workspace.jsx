import { useState, useRef, useEffect } from "react";
import {
  generateVideo,
  getGenerationStatus,
} from "../api/api";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 120;

export default function Workspace({ setGeneration, addToHistory }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("Runway Gen-4");
  const [style, setStyle] = useState("Realistic");
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState("10 sec");
  const [ratio, setRatio] = useState("16:9");
  const [camera, setCamera] = useState("Auto");
  const [fps, setFps] = useState("30 FPS");
  const [loading, setLoading] = useState(false);

  const pollRef = useRef(null);
  const pollCountRef = useRef(0);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollCountRef.current = 0;
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    stopPolling();
    setLoading(true);

    setGeneration({
      loading: true,
      progress: 10,
      status: "Sending request...",
      video: null,
    });

    try {
      const data = await generateVideo({
        prompt,
        model,
        style,
        resolution,
        duration,
        ratio,
        camera,
        fps,
      });

      if (data.status === "accepted") {
        setGeneration({
          loading: true,
          progress: 20,
          status: "Task Created",
          video: null,
        });

        pollRef.current = setInterval(async () => {
          pollCountRef.current += 1;

          if (pollCountRef.current > MAX_POLLS) {
            stopPolling();
            setLoading(false);
            setGeneration({
              loading: false,
              progress: 0,
              status: "Timed out",
              video: null,
            });
            alert("Generation timed out. Please try again.");
            return;
          }

          try {
            const status = await getGenerationStatus(
              data.provider,
              data.task_id,
            );

            if (
              status.status === "pending" ||
              status.status === "running" ||
              status.status === "throttled" ||
              status.status === "processing"
            ) {
              setGeneration((prev) => ({
                ...prev,
                progress: Math.min(prev.progress + 5, 90),
                status: status.status,
              }));
              return;
            }

            if (status.status === "success") {
              stopPolling();
              setLoading(false);
              setGeneration({
                loading: false,
                progress: 100,
                status: "Completed",
                video: status.video,
              });
              if (status.video && addToHistory) {
                addToHistory({
                  prompt,
                  model,
                  video: status.video,
                });
              }
              return;
            }

            if (
              status.status === "failed" ||
              status.status === "error"
            ) {
              stopPolling();
              setLoading(false);
              alert(status.message || "Generation Failed");
              setGeneration({
                loading: false,
                progress: 0,
                status: "Failed",
                video: null,
              });
            }
          } catch (err) {
            stopPolling();
            setLoading(false);
            const message = err?.message || "Unknown Error";
            setGeneration({
              loading: false,
              progress: 0,
              status: message,
              video: null,
            });
            alert(message);
          }
        }, POLL_INTERVAL_MS);

        return;
      }

      if (data.status === "error") {
        alert(data.message);
        setGeneration({
          loading: false,
          progress: 0,
          status: "Failed",
          video: null,
        });
        return;
      }

      setGeneration({
        loading: false,
        progress: 100,
        status: "Completed",
        video: data.video,
      });
      if (data.video && addToHistory) {
        addToHistory({
          prompt,
          model,
          video: data.video,
        });
      }
    } catch (err) {
      const message = err?.message || "Unknown Error";
      setGeneration({
        loading: false,
        progress: 0,
        status: message,
        video: null,
      });
      alert(message);
    } finally {
      if (!pollRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-5xl font-bold">
          Create AI Video
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Describe your idea and Flow AI will generate a realistic cinematic
          AI video.
        </p>
      </div>

      <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

        <div className="flex items-center justify-between mb-4">
          <label className="text-xl font-semibold">
            Prompt
          </label>

          <span
            className={`text-sm ${
              prompt.length > 2800
                ? "text-red-400"
                : "text-cyan-400"
            }`}
          >
            {prompt.length}/3000
          </span>
        </div>

        <textarea
          rows={9}
          maxLength={3000}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Example:

A cinematic drone shot flying over snowy mountains during sunrise.

Ultra realistic.

Natural lighting.

4K.

Slow camera movement.

Hollywood quality.

No text.
No watermark.
`}
          className="
            w-full
            rounded-2xl
            bg-[#0f1422]
            border
            border-white/10
            p-6
            outline-none
            resize-none
            text-lg
            transition-all
            duration-300
            focus:border-cyan-400
            focus:ring-2
            focus:ring-cyan-500/30
          "
        />

      </div>

      <div className="grid grid-cols-4 gap-5">

        <div>
          <label className="block mb-2 text-gray-400">
            AI Model
          </label>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>Runway Gen-4</option>
            <option>PixVerse</option>
            <option>Hailuo AI</option>
            <option>Veo 3</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">
            Style
          </label>

          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>Realistic</option>
            <option>Cinematic</option>
            <option>Photorealistic</option>
            <option>Anime</option>
            <option>3D Animation</option>
            <option>Cyberpunk</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">
            Resolution
          </label>

          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>720p</option>
            <option>1080p</option>
            <option>2K</option>
            <option>4K</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>5 sec</option>
            <option>10 sec</option>
          </select>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-5">

        <div>
          <label className="block mb-2 text-gray-400">
            Aspect Ratio
          </label>

          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
            <option>21:9</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">
            Camera Motion
          </label>

          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>Auto</option>
            <option>Static</option>
            <option>Drone</option>
            <option>Dolly</option>
            <option>Handheld</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">
            FPS
          </label>

          <select
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            className="w-full rounded-xl bg-[#171f34] p-4 border border-white/10"
          >
            <option>24 FPS</option>
            <option>30 FPS</option>
            <option>60 FPS</option>
          </select>
        </div>

      </div>

      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || loading}
        className={`
          w-full
          py-5
          rounded-2xl
          font-bold
          text-xl
          transition-all
          duration-300
          ${
            loading
              ? "bg-cyan-700 cursor-wait text-white"
              : prompt.trim()
              ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/40 hover:scale-[1.02]"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? "Generating..." : "🚀 Generate AI Video"}
      </button>

    </div>
  );
}
