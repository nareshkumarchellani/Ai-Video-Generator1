import { useState } from "react";
import { testRunwayKey } from "../api/api";

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

  const checkRunway = async () => {

    setStatus("Checking...");

    try {

      const result = await testRunwayKey(runwayKey);

      if (result.status === "success") {

        setStatus("✅ " + (result.message || "Runway Connected"));

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

        <input
          type="password"
          placeholder="Runway API Key"
          value={runwayKey}
          onChange={(e) => setRunwayKey(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
        />

        <input
          type="password"
          placeholder="Google Veo API Key"
          value={veoKey}
          onChange={(e) => setVeoKey(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
        />

        <input
          type="password"
          placeholder="PixVerse API Key"
          value={pixverseKey}
          onChange={(e) => setPixverseKey(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
        />

        <input
          type="password"
          placeholder="Hailuo API Key"
          value={hailuoKey}
          onChange={(e) => setHailuoKey(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#171f34] border border-white/10"
        />

        <button
          onClick={saveKeys}
          className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl hover:bg-cyan-400"
        >
          Save API Keys
        </button>

        <button
          onClick={checkRunway}
          className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400"
        >
          Test Runway Connection
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
