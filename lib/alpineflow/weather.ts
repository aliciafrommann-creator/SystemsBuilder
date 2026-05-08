export type WeatherData = {
  temp: number
  description: string
  main: string
  sunrise: string
  sunset: string
}

export async function fetchWeather(key: string): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Innsbruck,AT&units=metric&appid=${key}`
    )
    if (!res.ok) return null
    const d = await res.json()
    const fmt = (ts: number) =>
      new Date(ts * 1000).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
    return {
      temp: Math.round(d.main.temp),
      description: d.weather[0].description,
      main: d.weather[0].main,
      sunrise: fmt(d.sys.sunrise),
      sunset: fmt(d.sys.sunset),
    }
  } catch {
    return null
  }
}
