# WebSocket client
# Jacob Lowe
# Create sounds and connect to server to send messages

import asyncio
import threading
import typing

import numpy as np
import simpleaudio as sa
import websockets
from fastapi import FastAPI
from numpy import ndarray as NDArray

# Constants 

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

# Wave Generation Constants
START_TIME: float = 0.0 # Start time for wave generation

# Audio Constants
MAX_16BPCM: int = 32767 # Max 16-bit PCM value for audio wave generation (2^15 - 1)
NUM_CHANNELS: int = 1 # Number of audio channels (1 for mono, 2 for stereo)
SAMPLE_WIDTH: int = 2 # Sample width in bytes (16-bit PCM)
SAMPLE_RATE: int = 44100 # Sample rate in Hz (44.1 kHz)

# Sound Frequency Constants
# Boilerplate generated note frequencies 
note_freqs = {
    # Octave 0
    'A0': 27.50,
    'A#0': 29.14,
    'B0': 30.87,

    # Octave 1 
    'C1': 32.70,
    'C#1': 34.65,
    'D1': 36.71,
    'D#1': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1': 46.25,
    'G1': 49.00,
    'G#1': 51.91,
    'A1': 55.00,
    'A#1': 58.27,
    'B1': 61.74,

    # Octave 2
    'C2': 65.41,
    'C#2': 69.30,
    'D2': 73.42,
    'D#2': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'B2': 123.47,

    # Octave 3
    'C3': 130.81,
    'C#3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'B3': 246.94,

    # Octave 4 (Middle C)
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,

    # Octave 5
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.26,
    'F5': 698.46,
    'F#5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'B5': 987.77,

    # Octave 6
    'C6': 1046.50,
    'C#6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'F#6': 1479.98,
    'G6': 1567.98,
    'G#6': 1661.22,
    'A6': 1760.00,
    'A#6': 1864.66,
    'B6': 1975.53,

    # Octave 7
    'C7': 2093.00,
    'C#7': 2217.46,
    'D7': 2349.32,
    'D#7': 2489.02,
    'E7': 2637.02,
    'F7': 2793.83,
    'F#7': 2959.96,
    'G7': 3135.96,
    'G#7': 3322.44,
    'A7': 3520.00,
    'A#7': 3729.31,
    'B7': 3951.07,

    # Octave 8
    'C8': 4186.01
}

# Functions

# Function to generate silence
# duration: float - duration of silence in seconds
# returns: np.ndarray - array of zeros representing silence
def generate_silence(duration: float) -> np.ndarray:
    num_samples = int(duration * SAMPLE_RATE)
    return np.zeros(num_samples)

# Generate one wave for a given note and duration
# note: str - note to generate
# duration: float - duration of note in seconds
def generate_wave(note: str, duration: float) -> np.ndarray:
    # Generate time array
    t = np.linspace(START_TIME, duration, int(duration * 44100), False)
    # Generate wave
    wave = np.sin(note_freqs[note] * t * 2 * np.pi)
    return wave

# Generate all waves for a given sequence of notes and durations and concatenate them into one wave
# notes_and_durations: List[Tuple[str, float]] - list of tuples of notes and durations
# returns: np.ndarray - concatenated wave
def create_and_concatenate_waves(notes_and_durations: typing.List[typing.Tuple[str, float]]) -> np.ndarray:
    waves = [] # List of waves to concatenate
    silence_duration = 0.05 # Duration of silence between notes in seconds
    for note, duration in notes_and_durations:
        wave = generate_wave(note, duration)
        waves.append(wave)
        # Add silence after each note except the last one
        silence = generate_silence(silence_duration)
        waves.append(silence)
    full_wave = np.concatenate(waves) # Concatenate all waves and join them together (mux)
    return full_wave

# Play all notes in wave
# wave: np.ndarray - wave to play
def play_wave(wave: NDArray) -> sa.PlayObject:
    return sa.play_buffer((wave * MAX_16BPCM).astype(np.int16),
                               NUM_CHANNELS, SAMPLE_WIDTH, SAMPLE_RATE)


# TODO: Implement play_note and play_sound functions for on press for keyboard keys
# Play one note for a given duration
# note: str - note to play
# duration: float - play note for duration in seconds
def play_note(note: str, duration: float):
    wave = generate_wave(note, duration)
    play_obj = play_wave(wave)
    play_obj.wait_done()

# Play a sequence of notes
def play_sound():
    print("Playing hot cross buns sound...")
    # Tuple of (note, duration)
    notes_and_durations = [('B4', 0.5), ('A4', 0.5), ('G4', 1), ('B4', 0.5), ('A4', 0.5), ('G4', 1),
                           ('G4', 0.25),('G4', 0.25),('G4', 0.25),('G4', 0.25),
                            ('A4', 0.25), ('A4', 0.25), ('A4', 0.25), ('A4', 0.25),
                            ('B4', 0.5), ('A4', 0.5), ('G4', 1),
                           ]
    
    full_wave = create_and_concatenate_waves(notes_and_durations) # Concatenate all waves and join them together (mux)
    play_obj = play_wave(full_wave)
    play_obj.wait_done()

# Websocket chat functions for chatting to server
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
        print("client.py:223: Connection refused. Make sure server is running.")

# app = FastAPI()
# Play sound in the thread to allow async websocket communication
sound_thread = threading.Thread(target=play_sound)
sound_thread.start()
# Websocket Event Loop
asyncio.get_event_loop().run_until_complete(chat())

sound_thread.join() # Wait for sound thread to finish


