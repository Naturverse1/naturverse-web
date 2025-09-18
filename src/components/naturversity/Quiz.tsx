import { useEffect, useMemo, useState } from "react";
import type { NaturversityQuizItem } from "@/lib/ai/promptSchemas";

type Props = {
  items: NaturversityQuizItem[];
  onPassed?: () => void;
};

const normalize = (value: string) => value.trim().toLowerCase();

export default function NaturversityQuiz({ items, onPassed }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    setAnswers({});
    setChecked(false);
    setHasPassed(false);
  }, [items]);

  const allCorrect = useMemo(
    () =>
      items.length > 0 &&
      items.every((item, index) => normalize(answers[index] ?? "") === normalize(item.a)),
    [items, answers]
  );

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect && !hasPassed) {
      setHasPassed(true);
      onPassed?.();
    }
  };

  return (
    <div className="lesson-quiz__list">
      {items.map((item, index) => (
        <div key={`${item.q}-${index}`} className="lesson-quiz__item">
          <div className="lesson-quiz__prompt">
            <span className="lesson-quiz__number">{index + 1}.</span> {item.q}
          </div>
          {Array.isArray(item.choices) && item.choices.length ? (
            <div className="lesson-quiz__choices">
              {item.choices.map((choice) => (
                <label key={`${item.q}-${choice}`} className="lesson-quiz__choice">
                  <input
                    type="radio"
                    name={`quiz-${index}`}
                    value={choice}
                    checked={answers[index] === choice}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [index]: choice,
                      }))
                    }
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          ) : (
            <input
              className="lesson-quiz__input"
              value={answers[index] ?? ""}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  [index]: event.target.value,
                }))
              }
              placeholder="Your answer…"
            />
          )}
        </div>
      ))}

      <button
        type="button"
        className="lesson-quiz__check"
        onClick={handleCheck}
        disabled={!items.length}
      >
        Check answers
      </button>

      {checked && (
        <p className={`lesson-quiz__result ${allCorrect ? "is-correct" : "is-incorrect"}`}>
          {allCorrect
            ? "Great job! You passed."
            : "Not quite — tweak your answers and try again."}
        </p>
      )}
    </div>
  );
}
