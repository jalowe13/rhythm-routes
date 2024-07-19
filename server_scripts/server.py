import asyncio
import websockets
import typing

ADDRESS: str = "localhost"
PORT: int = 8765

async def echo(websocket, path):
    async for message in websocket:
        print(f"Recieved: {message}")
        await websocket.send(message)

print(ADDRESS)
print(f"With port {PORT}")

start_server = websockets.serve(echo, ADDRESS, PORT)

asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever(

)
