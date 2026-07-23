import { CHANNEL_ICON } from "../data/constants";
import { ENQUIRIES } from "../data/mockData";

export function ChannelSplit() {
  const counts = CHANNELS.map((ch) => ({
    name: ch,
    value: ENQUIRIES.filter((e) => e.channel === ch).length,
  }));
  const max = Math.max(...counts.map((c) => c.value));

  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5"
      style={{ animationDelay: "220ms" }}
    >
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
        Enquiry channels
      </h3>
      <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>
        Volume by intake source
      </p>
      <div className="mt-5 space-y-4">
        {counts.map((c) => {
          const Icon = CHANNEL_ICON[c.name];
          return (
            <div key={c.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span
                  className="flex items-center gap-1.5"
                  style={{ color: "var(--text-2)" }}
                >
                  <Icon size={12} /> {c.name}
                </span>
                <span className="font-mono" style={{ color: "var(--text-3)" }}>
                  {c.value}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--chip-bg)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(c.value / max) * 100}%`,
                    background:
                      "linear-gradient(90deg, var(--violet), var(--cyan))",
                    transition: "width .8s cubic-bezier(.16,1,.3,1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
