import { useCallback, useEffect, useRef } from "react"

export function useDebounceCallback<Args extends unknown[]>(
  callback: (...args: Args) => unknown,
  delay = 500,
) {
  const callbackRef = useRef(callback)
  const delayRef = useRef(delay)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lastArgsRef = useRef<Args | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    delayRef.current = delay
  }, [delay])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = null
    lastArgsRef.current = null
  }, [])

  const flush = useCallback(() => {
    const args = lastArgsRef.current
    if (!args) {
      return
    }
    cancel()
    callbackRef.current(...args)
  }, [cancel])

  // Again, just use Args directly
  const debounced = useCallback((...args: Args) => {
    lastArgsRef.current = args
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      const a = lastArgsRef.current
      lastArgsRef.current = null
      if (a) {
        callbackRef.current(...a)
      }
    }, delayRef.current)
  }, [])

  useEffect(() => cancel, [cancel])

  return Object.assign(debounced, { cancel, flush })
}
