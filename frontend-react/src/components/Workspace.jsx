import { useState } from "react";
import {
  generateVideo,
  getGenerationStatus,
} from "../api/api";


export default function Workspace({ setGeneration }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("Runway Gen-4");
  const [style, setStyle] =useState("Realistic");
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState("10 sec");
  const [ratio, setRatio] = useState("16:9");
  const [camera, setCamera] = useState("Auto");
  const [fps, setFps] = useState("30 FPS");
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
const [provider, setProvider] = useState(null);

  const handleGenerate = async () => {

  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  setLoading(true);

  setGeneration({
    loading: true,
    progress: 10,
    status: "Sending request...",
    video: null,
  });

  console.clear();

  console.table({
    prompt,
    model,
    style,
    resolution,
    duration,
    ratio,
    camera,
    fps,
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
    setGeneration({
      loading: true,
      progress: 60,
      status: "Generating...",
      video: null,
    });

    

    console.log("Backend Response");
    console.log(data);
    if (data.status === "accepted") {

  setTaskId(data.task_id);
  setProvider(data.provider);

  setGeneration({
    loading: true,
    progress: 20,
    status: "Task Created",
    video: null,
  });

  const interval = setInterval(async () => {

    try {

      const status = await getGenerationStatus(
        data.provider,
        data.task_id,
        localStorage.getItem("runway_api_key") || ""
      );

      console.log("Status:", status);

      if (
        status.status === "pending" ||
        status.status === "running" ||
        status.status === "throttled"
      ) {

        setGeneration((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
          status: status.status,
        }));

      }

      else if (status.status === "success") {

        clearInterval(interval);

        setGeneration({
          loading: false,
          progress: 100,
          status: "Completed",
          video: status.video,
        });

        setLoading(false);

      }

      else if (
        status.status === "failed" ||
        status.status === "error"
      ) {

        clearInterval(interval);

        alert(status.message || "Generation Failed");

        setGeneration({
          loading: false,
          progress: 0,
          status: "Failed",
          video: null,
        });

        setLoading(false);

      }

    } catch (err) {

  console.error(err);

  const message = err?.message || "Unknown Error";

  setGeneration({
    loading: false,
    progress: 0,
    status: message,
    video: null,
  });

  alert(message);

} finally {

  setLoading(false);

}

  }, 3000);

  return;
}

    // Backend Error
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

    // Success
    setGeneration({
      loading: false,
      progress: 100,
      status: "Completed",
      video: data.video,
    });

  } catch (err) {

  console.error(err);

  const message = err?.message || "Unknown Error";

  setGeneration({
    loading: false,
    progress: 0,
    status: message,
    video: null,
  });

  alert(message);

} finally {

  setLoading(false);

}

};

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-5xl font-bold">
          Create AI Video
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Describe your idea and Flow AI will generate a realistic cinematic
          AI video.
        </p>
      </div>

      {/* Prompt */}
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

      {/* Main Options */}
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
            <option>Luma Dream Machine</option>
            <option>Pika Labs</option>
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
            <option>15 sec</option>
            <option>30 sec</option>
            <option>45 sec</option>
            <option>1 minute</option>
            <option>2 minutes</option>
            <option>3 minutes</option>
          </select>
        </div>

      </div>

      {/* Advanced */}
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

      {/* Generate Button */}
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