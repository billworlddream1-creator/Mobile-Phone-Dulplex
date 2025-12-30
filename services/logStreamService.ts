
import { LogEntry } from "../types";

type LogCallback = (entry: LogEntry) => void;

class MockDeviceSocket {
  private interval: number | null = null;
  private onMessage: LogCallback | null = null;

  private systemEvents = [
    "Kernel: CPU scheduler balanced",
    "IO: USB-C Power Delivery handshaking (9V/2A)",
    "Net: Background sync initiated for 'NexusCloud'",
    "Sys: Thermal throttle check - 34°C (Normal)",
    "Mem: GC cycle reclaimed 42MB in 12ms",
    "App: com.android.systemui reported heartbeat",
    "Sec: TEE environment integrity verified",
    "Bat: Current draw 120mA (Screen ON)",
    "Log: Writing buffer to persistent storage",
    "Proc: PID 4412 (Launcher) priority elevated"
  ];

  connect(callback: LogCallback) {
    this.onMessage = callback;
    this.startStreaming();
  }

  private startStreaming() {
    if (this.interval) return;

    this.interval = window.setInterval(() => {
      if (this.onMessage) {
        const randomIndex = Math.floor(Math.random() * this.systemEvents.length);
        const types: LogEntry['type'][] = ['info', 'success', 'warning'];
        const type = Math.random() > 0.9 ? 'warning' : types[Math.floor(Math.random() * types.length)];
        
        this.onMessage({
          timestamp: new Date().toLocaleTimeString(),
          message: this.systemEvents[randomIndex],
          type
        });
      }
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.onMessage = null;
  }
}

export const logStream = new MockDeviceSocket();
