// Hardware Abstraction Layer (prototype)
export type DeviceInfo = {
  id: string;
  type: 'cpu' | 'gpu';
  name?: string;
  memoryMB?: number;
};

// Query available devices (stubbed). In production this would call a native
// binding or use a daemon to enumerate GPUs and their characteristics.
export async function listDevices(): Promise<DeviceInfo[]> {
  // Heuristic: if NVIDIA_VISIBLE_DEVICES is set, expose a GPU device.
  if (process.env.NVIDIA_VISIBLE_DEVICES) {
    return [
      { id: 'gpu0', type: 'gpu', name: 'nvidia-gpu', memoryMB: 16384 },
      { id: 'cpu0', type: 'cpu', name: 'host-cpu', memoryMB: 32768 },
    ];
  }

  return [{ id: 'cpu0', type: 'cpu', name: 'host-cpu', memoryMB: 32768 }];
}

export function chooseDevice(preferGPU = true): DeviceInfo {
  const devices = listDevices();
  // Note: listDevices returns a Promise; keep this simple for prototype.
  // In a real implementation, make this async and await devices.
  // We'll return a sensible default.
  if (preferGPU && process.env.NVIDIA_VISIBLE_DEVICES) {
    return { id: 'gpu0', type: 'gpu', name: 'nvidia-gpu', memoryMB: 16384 };
  }
  return { id: 'cpu0', type: 'cpu', name: 'host-cpu', memoryMB: 32768 };
}
