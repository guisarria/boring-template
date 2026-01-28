"use client"

import { cn } from "@/lib/utils"
import { useRef, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"

type CanvasAnimationProps = {
  lightBackground?: string
  lightForeground?: string
  darkBackground?: string
  darkForeground?: string
  className?: string
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

const CanvasAnimation = ({
  lightBackground = "#ffffff",
  lightForeground = "#000000",
  darkBackground = "#000000",
  darkForeground = "#ffffff",
  className
}: CanvasAnimationProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const bgColor = useMemo(
    () => hexToRgb(isDark ? darkBackground : lightBackground),
    [isDark, darkBackground, lightBackground]
  )
  const fgColor = useMemo(
    () => hexToRgb(isDark ? darkForeground : lightForeground),
    [isDark, darkForeground, lightForeground]
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // const frequency = 42
    // const cellSize = 6
    const cellSize = 4

    const noise = (seed: number, time: number) => {
      const floorTime = Math.floor(time)
      const val1 = Math.sin(
        (Math.cos(floorTime * seed) + Math.sin(floorTime * 1024)) * 345 + seed
      )
      const val2 = Math.sin(
        (Math.cos((floorTime + 1) * seed) + Math.sin((floorTime + 1) * 1024)) *
          345 +
          seed
      )
      const fraction = time - floorTime
      const smoothstep = fraction * fraction * (3 - 2 * fraction)
      return val1 + (val2 - val1) * smoothstep
    }

    // const layeredNoise = (seed: number, coords: number[]) => {
    //   let result = noise(seed, coords[2] + coords[0])
    //   result = result + noise(seed, coords[0] + coords[1] + result)
    //   result = result + noise(seed, coords[1] + coords[2] + result)
    //   return result * 0.3333333333
    // }

    const isVisible = (threshold: number, position: number[]) =>
      Math.sin(position[0]) * Math.sin(position[1]) +
        Math.cos(position[1]) * Math.cos(position[0]) >=
      threshold * 1.5

    const render = () => {
      if (!ctx) return

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      const time = timeRef.current * 0.125

      const transformA = [
        noise(-16405.31527, time - 1.11),
        noise(-77664.8142, time + 1.41),
        noise(-50993.519, time + 2.61)
      ].map((v) => v * 5)

      const transformB = [
        noise(-10527.92407, time - 1.11),
        noise(-61557.6687, time + 1.41),
        noise(-43527.899, time + 2.61)
      ].map((v) => v * 5)

      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)
      const imageData = ctx.createImageData(width, height)
      const pixels = imageData.data
      const timeFactor = timeRef.current * 71

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cellSize
          const y = row * cellSize
          const uv = [x / width, y / height]

          const coords = [
            0.0004375 * time + transformB[0] * uv[0] + transformA[0] * uv[1],
            0.0005625 * time + transformB[1] * uv[0] + transformA[1] * uv[1],
            0.0008125 * time + transformB[2] * uv[0] + transformA[2] * uv[1]
          ]

          // coords[0] = layeredNoise(frequency, coords)
          // coords[1] = layeredNoise(frequency, coords)
          // coords[2] = layeredNoise(frequency, coords)

          const waveValue = Math.sin(coords[2] * Math.PI)
          const scaledPos = [uv[0] * timeFactor, uv[1] * timeFactor]
          const isForeground = isVisible(waveValue, scaledPos)
          const color = isForeground ? fgColor : bgColor

          for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
            for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4
              pixels[idx] = color[0]
              pixels[idx + 1] = color[1]
              pixels[idx + 2] = color[2]
              pixels[idx + 3] = 255
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      timeRef.current += 0.015
      render()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [bgColor, fgColor])

  return (
    <canvas
      ref={canvasRef}
      className={cn( className)}
      style={{ display: "block" }}
    />
  )
}

export default CanvasAnimation
