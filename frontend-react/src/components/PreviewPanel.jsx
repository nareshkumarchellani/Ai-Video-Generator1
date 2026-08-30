import { Loader2, CheckCircle2, Video } from "lucide-react";

export default function PreviewPanel({ generation }) {
  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">
        Preview
      </h2>

      {/* Preview Box */}
      <div className="aspect-video rounded-2xl border border-white/10 bg-[#111827] flex items-center justify-center overflow-hidden">

        {generation.loading ? (
          <div className="text-center">

            <Loader2
              size={50}
              className="animate-spin mx-auto text-cyan-400"
            />

            <p className="mt-4 text-lg">
              {generation.status}
            </p>

          </div>
        ) : generation.video ? (

          <video
            controls
            className="w-full h-full object-cover"
            src={generation.video}
          />

        ) : (

          <div className="text-center text-gray-400">

            <Video
              size={60}
              className="mx-auto mb-4"
            />

            <p>No video generated yet</p>

          </div>

        )}

      </div>

      {/* Progress */}
      <div>

        <div className="flex justify-between mb-2">
          <span>Progress</span>
          <span>{generation.progress}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{
              width: `${generation.progress}%`,
            }}
          />

        </div>

      </div>

      {/* Status */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">

        <div className="flex items-center gap-3">

          <CheckCircle2 className="text-cyan-400" />

          <div>
            <div className="font-semibold">
              Status
            </div>

            <div className="text-gray-400">
              {generation.status || "Idle"}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}