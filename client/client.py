# WebSocket client

import asyncio
import websockets
import typing
from fastapi import FastAPI
# Websockets Constants
# Craft websocket path
ADDRESS: str = "localhost"
PORT: int = 8765
WS_URL: str = f"ws://{ADDRESS}:{PORT}"
# API Constants
# Craft Generic API Path
API_VERSION_NUM: int = 1
API_VERSION: str = f"v{API_VERSION_NUM}"
API_S: str = f"/api/{API_VERSION}"



async def chat():
    async with websockets.connect(WS_URL) as websocket:
        while True:
            message = input("Enter message to send or 'quit' to exit: ")
            if message == 'quit':
                break
            await websocket.send(message)
            response = await websocket.recv()
            print(f"Received: {response}")

# app = FastAPI()

# Websocket Event Loop
asyncio.get_event_loop().run_until_complete(chat())


