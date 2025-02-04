import { useCallback, useEffect, useRef, useState } from "react";
import "./GameField.scss";
const rows = 15;

type TCords = {
  x: number;
  y: number;
};

const GameField = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(1);
  const [applePos, setApplePos] = useState<TCords | null>();
  const [snakeCords, setSnake] = useState<TCords[]>([
    { x: Math.floor(rows / 2), y: Math.floor(rows / 2) },
  ]);

  const goToRef = useRef<"left" | "right" | "up" | "down">("left");
  const fieldRef = useRef<number[][]>(new Array(rows).fill(0).map(() => new Array(rows).fill(0)));

  const cellIsSnake = (x: number, y: number) => {
    return snakeCords.some((cord) => cord.x === x && cord.y === y);
  };

  const cellIsApple = useCallback(
    (x: number, y: number) => {
      return applePos?.x === x && applePos?.y === y;
    },
    [applePos]
  );

  const restartGame = useCallback(() => {
    setSnake([{ x: Math.floor(rows / 2), y: Math.floor(rows / 2) }]);
    setScore(1);
    goToRef.current = "left";
    setIsGameOver(false);
  }, [setSnake, setScore, setIsGameOver, goToRef]);

  useEffect(() => {
    document.addEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "ArrowLeft":
          goToRef.current = goToRef.current !== "right" ? "left" : goToRef.current;
          break;
        case "ArrowRight":
          goToRef.current = goToRef.current !== "left" ? "right" : goToRef.current;
          break;
        case "ArrowUp":
          goToRef.current = goToRef.current !== "down" ? "up" : goToRef.current;
          break;
        case "ArrowDown":
          goToRef.current = goToRef.current !== "up" ? "down" : goToRef.current;
          break;
      }
    });

    return document.removeEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "ArrowLeft":
          goToRef.current = goToRef.current !== "right" ? "left" : goToRef.current;
          break;
        case "ArrowRight":
          goToRef.current = goToRef.current !== "left" ? "right" : goToRef.current;
          break;
        case "ArrowUp":
          goToRef.current = goToRef.current !== "down" ? "up" : goToRef.current;
          break;
        case "ArrowDown":
          goToRef.current = goToRef.current !== "up" ? "down" : goToRef.current;
          break;
      }
    });
  }, [goToRef]);

  const generateCellClass = (x: number, y: number): string => {
    const className = `cell ${
      cellIsApple(x, y)
        ? "apple"
        : cellIsSnake(x, y) && applePos
        ? `snake ${snakeCords[0].x === x && snakeCords[0].y === y ? goToRef.current : ""}`
        : ""
    }`;
    return className;
  };

  useEffect(() => {
    if (!isGameOver)
      setTimeout(() => {
        const newSnake = [...snakeCords];
        const head = { ...newSnake[0] };
        switch (goToRef.current) {
          case "left":
            head.x--;
            break;
          case "right":
            head.x++;
            break;
          case "up":
            head.y--;
            break;
          case "down":
            head.y++;
            break;
        }

        if (
          cellIsSnake(head.x, head.y) &&
          head.x !== snakeCords[score - 1].x &&
          head.y !== snakeCords[score - 1].y
        ) {
          setIsGameOver(true);
        } else {
          if (head.x < 0) head.x = rows - 1;
          if (head.y < 0) head.y = rows - 1;

          if (head.x >= rows) head.x = 0;
          if (head.y >= rows) head.y = 0;

          if (cellIsApple(head.x, head.y)) {
            setApplePos(null);
            setScore(score + 1);
          }

          newSnake.unshift(head);
          score !== newSnake.length && newSnake.pop();
          setSnake(newSnake);
        }
      }, 200 - (score >= 200 ? 80 : score * 0.4));
  }, [goToRef, snakeCords, applePos, cellIsApple, cellIsSnake]);

  useEffect(() => {
    const getApple = (): TCords => {
      const apple = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * rows),
      };

      return snakeCords.some((snake) => snake.x === apple.x && snake.y === apple.y)
        ? getApple()
        : apple;
    };
    if (!applePos) setApplePos(getApple());
  }, [snakeCords, applePos, snakeCords]);

  return (
    <>
      <div className="gameField" onKeyDown={(ev) => console.log(ev)}>
        {fieldRef.current.map((row, rowIndex) => (
          <div key={`row_${rowIndex}`} className="row">
            {row.map((cell, cellIndex) => (
              <div
                key={`cell_${cellIndex}_${cell}`}
                style={{
                  width: `calc(40vw / ${rows})`,
                  height: `calc(40vw / ${rows})`,
                  boxShadow: cellIsSnake(cellIndex, rowIndex)
                    ? `inset 0 0 0 ${
                        4 / snakeCords.findIndex((el) => el.x === cellIndex && el.y === rowIndex)
                      }px black`
                    : "",
                }}
                className={generateCellClass(cellIndex, rowIndex)}
              ></div>
            ))}
          </div>
        ))}
        {/* <div className="remote">
        <button
        onClick={() => (goToRef.current = goToRef.current !== "down" ? "up" : goToRef.current)}
        >
          top
        </button>
        <div>
        <button
        onClick={() =>
        (goToRef.current = goToRef.current !== "right" ? "left" : goToRef.current)
        }
        >
        left
        </button>
        <button
        onClick={() => (goToRef.current = goToRef.current !== "up" ? "down" : goToRef.current)}
        >
        down
        </button>
        <button
        onClick={() =>
        (goToRef.current = goToRef.current !== "left" ? "right" : goToRef.current)
        }
        >
            right
          </button>
          </div>
          </div> */}
        {isGameOver && (
          <div className="gameOver">
            <div>Game Over</div>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
      <div className="score">score: {score - 1}</div>
    </>
  );
};

export default GameField;
