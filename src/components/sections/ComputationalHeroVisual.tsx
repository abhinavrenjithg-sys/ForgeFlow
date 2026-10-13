import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Layers, Terminal } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  active: boolean;
  intensity: number;
  label?: string;
  type: 'core' | 'inference' | 'tensor' | 'edge';
}

export const ComputationalHeroVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    activeNodes: 48,
    latency: '14.2 ms',
    tensorRate: '8.4 TFLOPS',
    systemState: 'ACTIVE_INFERENCE'
  });

  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Node graph generation
    let nodes: Node[] = [];
    const initNodes = () => {
      nodes = [];
      const nodeCount = Math.min(Math.floor((width * height) / 8000), 48);

      for (let i = 0; i < nodeCount; i++) {
        const isCore = i < 4;
        const isTensor = i >= 4 && i < 14;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: isCore ? 3.5 : isTensor ? 2.5 : 1.8,
          baseRadius: isCore ? 3.5 : isTensor ? 2.5 : 1.8,
          active: isCore || Math.random() > 0.6,
          intensity: Math.random(),
          label: isCore ? `CORE-0${i + 1}` : undefined,
          type: isCore ? 'core' : isTensor ? 'tensor' : 'inference'
        });
      }
    };

    initNodes();

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const onMouseLeave = () => {
      mousePos.current.active = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let lastTime = performance.now();
    let frameCount = 0;

    const render = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setTelemetry((prev) => ({
          ...prev,
          fps: frameCount,
          latency: (12.8 + Math.random() * 2.4).toFixed(1) + ' ms',
          tensorRate: (8.2 + Math.random() * 0.5).toFixed(1) + ' TFLOPS'
        }));
        frameCount = 0;
        lastTime = time;
      }

      ctx.clearRect(0, 0, width, height);

      // Background technical grid lines inside canvas
      ctx.strokeStyle = 'rgba(220, 235, 215, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect nodes
      const maxDistance = 120;
      const mouseMaxDistance = 160;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        // Mouse attraction/illumination
        if (mousePos.current.active) {
          const dx = mousePos.current.x - node.x;
          const dy = mousePos.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseMaxDistance) {
            const force = (1 - dist / mouseMaxDistance) * 0.08;
            node.vx += dx * force * 0.05;
            node.vy += dy * force * 0.05;
            node.intensity = Math.min(node.intensity + 0.05, 1);
          }
        }

        // Draw connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (node.active && other.active ? 0.35 : 0.12);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);

            if (node.type === 'core' || other.type === 'core') {
              ctx.strokeStyle = `rgba(199, 255, 69, ${alpha * 1.5})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(220, 235, 215, ${alpha})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();

            // Intermittent data packet pulse
            if (node.active && other.active && (i + j) % 5 === 0) {
              const pulseProgress = ((time * 0.001) + (i * 0.2)) % 1;
              const px = node.x + dx * pulseProgress;
              const py = node.y + dy * pulseProgress;
              ctx.fillStyle = '#C7FF45';
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.type === 'core') {
          // Glow core
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 14);
          gradient.addColorStop(0, 'rgba(199, 255, 69, 0.9)');
          gradient.addColorStop(0.4, 'rgba(199, 255, 69, 0.25)');
          gradient.addColorStop(1, 'rgba(199, 255, 69, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#C7FF45';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Technical label
          if (node.label) {
            ctx.fillStyle = 'rgba(245, 247, 242, 0.65)';
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText(node.label, node.x + 8, node.y - 6);
          }
        } else if (node.type === 'tensor') {
          ctx.fillStyle = node.active ? '#C7FF45' : 'rgba(220, 235, 215, 0.4)';
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(220, 235, 215, 0.3)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] rounded-2xl overflow-hidden bg-[#0D100E] border border-[rgba(220,235,215,0.12)] shadow-2xl flex flex-col justify-between"
    >
      {/* Top Technical HUD Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-[#131713]/85 border-b border-[rgba(220,235,215,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9BA39A]">
          <span className="w-2 h-2 rounded-full bg-[#C7FF45] animate-ping" />
          <span className="text-[#C7FF45] font-semibold">NEURAL MESH V4</span>
          <span className="text-[#697168]">/</span>
          <span className="hidden sm:inline text-[#F5F7F2]">COMPUTATIONAL GRAPH</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] text-[#9BA39A]">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#C7FF45]" />
            <span className="hidden xs:inline text-[#697168]">FPS:</span>
            <span className="text-[#F5F7F2]">{telemetry.fps}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#C7FF45]" />
            <span className="hidden xs:inline text-[#697168]">LATENCY:</span>
            <span className="text-[#F5F7F2]">{telemetry.latency}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

        {/* Floating Geometric Alignment Ticks */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] text-[#697168] space-y-1">
          <div>LOC // 37.7749° N, 122.4194° W</div>
          <div>MEM // VRAM ALLOC: 18.4GB / 24GB</div>
          <div>QUANT // INT4-TENSOR-RT</div>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none hidden sm:block font-mono text-[9px] text-[#697168] text-right space-y-1">
          <div>TOPOLOGY // SPARSE GRAPH</div>
          <div>THROUGHPUT // {telemetry.tensorRate}</div>
          <div className="text-[#C7FF45]">STATE // CONVERGED</div>
        </div>

        {/* Central Crosshair Graphic */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="relative w-48 h-48 border border-dashed border-[#C7FF45] rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
            <div className="w-32 h-32 border border-[#C7FF45] rounded-full" />
            <div className="absolute w-full h-[1px] bg-[#C7FF45]" />
            <div className="absolute h-full w-[1px] bg-[#C7FF45]" />
          </div>
        </div>
      </div>

      {/* Bottom Technical Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-[#131713]/85 border-t border-[rgba(220,235,215,0.08)] backdrop-blur-md font-mono text-[10px] text-[#697168]">
        <div className="flex items-center gap-2">
          <Layers className="w-3 h-3 text-[#C7FF45]" />
          <span>AUTONOMOUS INFERENCE STREAM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#9BA39A]">INTERACTIVE: HOVER TO PERTURB</span>
          <Terminal className="w-3 h-3 text-[#9BA39A]" />
        </div>
      </div>
    </div>
  );
};
