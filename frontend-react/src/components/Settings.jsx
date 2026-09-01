import { useState } from "react";
import { testProviderKey } from "../api/api";

export default function Settings() {
  const [runwayKey, setRunwayKey] = useState(
    () => localStorage.getItem("runway_api_key") || ""
  );
  const [veoKey, setVeoKey] = useState(
    () => localStorage.getItem("veo_api_key") || ""
  );
  const [pixverseKey, setPixverseKey] = useState(
    () => localStorage.getItem("pixverse_api_key") || ""
  );
  const [hailuoKey, setHailuoKey] = useState(
    () => localStorage.getItem("hailuo_api_key") || ""
  );

  const [status, setStatus] = useState("");

  const saveKeys = () => {
    localStorage.setItem("runway_api_key", runwayKey);
    localStorage.setItem("veo_api_key", veoKey);
    localStorage.setItem("pixverse_api_key", pixverseKey);
    localStorage.setItem("hailuo_api_key", hailuoKey);
    alert("API Keys Saved Successfully");
  };

  const testConnection = async (provider) => {
    setStatus(`Checking ${provider}...`);

    // Test karne se pehle keys ko localStorage mein save kar dein taaki API request mein sahi headers jayein
    localStorage.setItem("runway_api_key", runwayKey);
    localStorage.setItem("veo_api_key", veoKey);
    localStorage.setItem("pixverse_api_key", pixverseKey);
    localStorage.setItem("hailuo_api_key", hailuoKey);

    try {
      const result = await testProviderKey(provider);

      if (result.status === "success") {
        setStatus("✅ " + (result.message || `${provider} Connected`));
      } else {
        setStatus(
          "❌ " +
          (
            result.message ||
            result.detail ||
            JSON.stringify(result)
          )
        );
      }
    } catch (e) {
      setStatus(
        "❌ " +
        (
          e.message ||
          "Connection Failed"
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        API Settings
      </h1>

      <div className="space-y-4">
        {/* Runway */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Runway API Key"
            value={runwayKey}
            onChange={(e) => setRunwayKey(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
          />
          <button
            onClick={() => testConnection("Runway")}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400"
          >
            Test Runway Connection
          </button>
        </div>

        {/* Veo */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Google Veo API Key"
            value={veoKey}
            onChange={(e) => setVeoKey(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
          />
          <button
            onClick={() => testConnection("Veo")}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400"
          >
            Test Veo Connection
          </button>
        </div>

        {/* PixVerse */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder="PixVerse API Key"
            value={pixverseKey}
            onChange={(e) => setPixverseKey(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
          />
          <button
            onClick={() => testConnection("PixVerse")}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400"
          >
            Test PixVerse Connection
          </button>
        </div>

        {/* Hailuo */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Hailuo API Key"
            value={hailuoKey}
            onChange={(e) => setHailuoKey(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
          />
          <button
            onClick={() => testConnection("Hailuo")}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400"
          >
            Test Hailuo Connection
          </button>
        </div>

        <button
          onClick={saveKeys}
          className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl hover:bg-cyan-400 mt-4"
        >
          Save All API Keys
        </button>

        {status && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center text-cyan-300">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}