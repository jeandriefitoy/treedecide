"use client";

import { motion } from "framer-motion";

const lineDelays = [0, 0.15, 0.3, 0.45, 0.6, 0.75];

export function AnimatedTreeIcon() {
    return (
        <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-400/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg viewBox="0 0 100 100" className="relative h-16 w-16">
                {[
                    { x1: 50, y1: 22, x2: 30, y2: 50 },
                    { x1: 50, y1: 22, x2: 70, y2: 50 },
                    { x1: 30, y1: 50, x2: 20, y2: 78 },
                    { x1: 30, y1: 50, x2: 40, y2: 78 },
                    { x1: 70, y1: 50, x2: 60, y2: 78 },
                    { x1: 70, y1: 50, x2: 80, y2: 78 },
                ].map((line, i) => (
                    <motion.line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: lineDelays[i],
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 1.2,
                        }}
                    />
                ))}

                {[
                    { cx: 50, cy: 20, delay: 0 },
                    { cx: 30, cy: 50, delay: 0.2 },
                    { cx: 70, cy: 50, delay: 0.4 },
                ].map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.cx}
                        cy={node.cy}
                        r={6}
                        fill="#10b981"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{
                            duration: 1.6,
                            delay: node.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                <circle cx="20" cy="80" r="4" fill="#10b981" />
                <circle cx="40" cy="80" r="4" fill="#ef4444" />
                <circle cx="60" cy="80" r="4" fill="#10b981" />
                <circle cx="80" cy="80" r="4" fill="#ef4444" />
            </svg>
        </div>
    );
}