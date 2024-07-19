import sys
import platform
import asyncio
import threading
import typing
import numpy as np
import simpleaudio as sa
import websockets
import evdev
from evdev import InputDevice, categorize, ecodes

# Constants
ADDRESS = "localhost"
PORT = 8765
WS_URL = f"ws://{ADDRESS}:{PORT}"

# Audio Constants
MAX_16BPCM = 32767
NUM_CHANNELS = 1
SAMPLE_WIDTH = 2
SAMPLE_RATE = 44100

# Note frequencies and key mappings (keep as in the original code)
note_freqs = {
    'A4': 440.00,
    'A#0/Bb0': 29.14,
    'B0': 30.87,
    # ... (include all note frequencies)
}

key_note_mapping = {
    ecodes.KEY_Q: 'A4',
    ecodes.KEY_2: 'A#0/Bb0',
    ecodes.KEY_W: 'B0',
    # ... (map all keys to notes using evdev key codes)
}

# States
key_state = {}

def generate_wave(note: str, duration: float) -> np.ndarray:
    t = np.linspace(0, duration, int(duration * SAMPLE_RATE), False)
    wave = np.sin(note_freqs[note] * t * 2 * np.pi)
    return wave

def play_wave(wave: np.ndarray) -> sa.PlayObject:
    return sa.play_buffer((wave * MAX_16BPCM).astype(np.int16),
                          NUM_CHANNELS, SAMPLE_WIDTH, SAMPLE_RATE)

def play_note(note: str):
    wave = generate_wave(note, 4)
    play_obj = play_wave(wave)
    return play_obj

def setup_input_device():
    devices = [evdev.InputDevice(path) for path in evdev.list_devices()]
    for device in devices:
        if "keyboard" in device.name.lower():
            return device
    raise IOError("No keyboard found")

def handle_events(device):
    for event in device.read_loop():
        if event.type == ecodes.EV_KEY:
            key_event = categorize(event)
            if key_event.keystate == key_event.key_down:
                on_press(key_event.keycode)
            elif key_event.keystate == key_event.key_up:
                on_release(key_event.keycode)

def on_press(keycode):
    if keycode in key_note_mapping and keycode not in key_state:
        note = key_note_mapping[keycode]
        print(f"Starting note: {note}")
        play_obj = play_note(note)
        key_state[keycode] = play_obj

def on_release(keycode):
    if keycode in key_state:
        note = key_note_mapping[keycode]
        print(f"Stopping note: {note}")
        key_state[keycode].stop()
        del key_state[keycode]

async def chat():
    try:
        async with websockets.connect(WS_URL) as websocket:
            while True:
                message = input("Enter message to send or 'quit' to exit: ")
                if message == 'quit':
                    break
                await websocket.send(message)
                response = await websocket.recv()
                print(f"Received: {response}")
    except ConnectionRefusedError:
        print("Connection refused. Make sure server is running.")

async def main():
    device = setup_input_device()
    input_thread = threading.Thread(target=handle_events, args=(device,))
    input_thread.start()

    await chat()

    input_thread.join()

if __name__ == "__main__":
    asyncio.run(main())
