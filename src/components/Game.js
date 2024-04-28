import React, { useState, useEffect } from 'react';
import Duck from './Duck';
import './Game.css';
import shotgunSoundSrc from './shotgun.mp3';
import duckHitSrc from './q.mp3';

const Game = () => {
    const [score, setScore] = useState(0);
    const [shots, setShots] = useState(10);
    const [ducks, setDucks] = useState([]);
    const [gameOver, setGameOver] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [gameStarted, setGameStarted] = useState(false);

    const shotgunSound = new Audio(shotgunSoundSrc);
    const duckHit = new Audio(duckHitSrc);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const addDucks = setInterval(() => {
                const startPosition = Math.random() * 100;
                setDucks(currentDucks => [
                    ...currentDucks,
                    { id: Math.random(), type: 'normal', hit: false, startPosition }
                ]);
            }, 2000);

            return () => clearInterval(addDucks);
        }
    }, [gameStarted, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && gameStarted) {
                quitGame();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted]);

    const hitDuck = (id) => {
        const duckIndex = ducks.findIndex(duck => duck.id === id);
        if (duckIndex > -1 && !ducks[duckIndex].hit) {
            console.log(`Hitting duck with id: ${id}`);
            setScore(score + 10);
            setDucks(ducks => ducks.filter(duck => duck.id !== id));
            setShots(shots => shots + 3);
            shotgunSound.play();
            duckHit.play();
        }
    };

    const quitGame = () => {
        setGameOver(true);
        setGameStarted(false);
        const data = `Player: ${playerName}`;
        const blob = new Blob([data], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = "game_score.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const startGame = () => {
        setGameOver(false);
        setGameStarted(true);
        setScore(0);
        setShots(10);
        setDucks([]);
    };

    return (
        <div className="gameArea">
            {gameStarted ? (
                <>
                    <div onClick={(e) => {
                        console.log("click");
                        if (shots > 0 && !gameOver) {
                            setShots(shots - 1);
                            console.log("click");
                            shotgunSound.play();
                        }
                    }}>
                        <div className="scoreboard">Score: {score}</div>
                        <div className="shotboard">Shots: {shots}</div>
                        {ducks.map(duck => (
                            <Duck key={duck.id} duck={duck} hitDuck={() => hitDuck(duck.id)} />
                        ))
                        }
                    </div>
                </>
            ) : (
                <div className="startForm">
                    <input
                        type="text"
                        placeholder="Enter Player Name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={startGame}>Start Game</button>
                </div>
            )}
            {gameOver && !gameStarted && (
                <div className="gameOverMessage">Game Over. Player is, {playerName}.</div>
            )}
        </div>
    );
};

export default Game;
