body {
  margin: 0;
  padding: 0;
  background: radial-gradient(circle, #001eff, #000);
  font-family: 'Orbitron', sans-serif;
  color: #00ff9f;
  text-align: center;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#loadingScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #001eff, #000);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  z-index: 1000;
}

.hidden {
  display: none !important;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.title {
  font-size: 3rem;
  text-shadow: 0 0 10px #00ff9f, 0 0 20px #00b8ff, 0 0 30px #001eff;
  margin-bottom: 20px;
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  0% { text-shadow: 0 0 10px #00ff9f, 0 0 20px #00b8ff, 0 0 30px #001eff; }
  100% { text-shadow: 0 0 20px #00ff9f, 0 0 40px #00b8ff, 0 0 60px #001eff; }
}

button {
  background: #bd00ff;
  color: #00ff9f;
  border: none;
  padding: 15px 30px;
  font-size: 1.5rem;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 10px #00ff9f, 0 0 20px #00b8ff;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}

#gameContainer {
  display: none;
  margin-top: 20px;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

#sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#scoreboard {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00ff9f;
}

#flirtyMessages {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00b8ff;
  font-size: 1.2rem;
  color: #bd00ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

canvas {
  border: 5px solid #00ff9f;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 20px #00b8ff;
}

#timerDisplay {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  text-shadow: 0 0 10px #00ff9f;
}

#message {
  display: none;
  font-size: 2rem;
  text-shadow: 0 0 10px #00ff9f, 0 0 20px #00b8ff;
  margin-top: 20px;
}

#mobileControls {
  display: none;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

#mobileControls button {
  padding: 10px 20px;
  font-size: 1.2rem;
}

.balloon {
  position: absolute;
  width: 50px;
  height: 70px;
  background: #00ff9f;
  border-radius: 50%;
  animation: float 5s ease-in infinite;
  box-shadow: 0 0 10px #00ff9f, 0 0 20px #00b8ff;
}

@keyframes float {
  0% { transform: translateY(100vh); }
  100% { transform: translateY(-100vh); }
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  canvas {
    width: 80vw;
    height: 60vh;
  }

  #mobileControls {
    display: flex;
  }
}
