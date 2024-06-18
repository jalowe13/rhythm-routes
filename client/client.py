# WebSocket client

import asyncio
import websockets

async def chat():
    async with websockets.connect('ws://10.0.0.14:8765') as websocket:
        while True:
            message = input("Enter message to send or 'quit' to exit: ")
            if message == 'quit':
                break
            await websocket.send(message)
            response = await websocket.recv()
            print(f"Received: {response}")

asyncio.get_event_loop().run_until_complete(chat())
