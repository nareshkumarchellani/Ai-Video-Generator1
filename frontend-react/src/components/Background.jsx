export default function Background() {
    return (
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#060816]">
  
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
  
        {/* Glow 1 */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/30 blur-[180px]" />
  
        {/* Glow 2 */}
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[180px]" />
  
        {/* Glow 3 */}
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/20 blur-[140px] -translate-x-1/2 -translate-y-1/2" />
  
      </div>
    );
  }