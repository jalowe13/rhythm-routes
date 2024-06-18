import asyncio
import websockets


async def test():
    print("Hello World")


async def echo(websocket, path):
    async for message in websocket:
        print(f"Recieved: {message}")
        await websocket.send(message)

start_server = websockets.serve(echo, "10.0.0.14", 8765)

asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever(

)
