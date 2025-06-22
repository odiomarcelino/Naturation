from fastapi import FastAPI
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

API_URL = "https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&current_weather=true"

@app.get("/")
async def read_root():
    """Return current weather data fetched from a public API. This is a placeholder
    service to demonstrate Python on Vercel. Front-end calls /api/weather."""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(API_URL, timeout=5)
            data = res.json()
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=500)
    return {"weather": data.get("current_weather", {})}
