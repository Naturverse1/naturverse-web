import React from "react";
import { Story, Scene } from "../lib/story/types";

export type Progress = { storyId: string; at: string; history: string[] };

export const StoryPlayer: React.FC<{
  story: Story;
  progress: Progress;
  onProgress: (p: Progress) => void;
}> = ({ story, progress, onProgress }) => {
  const scene = (story.scenes.find(s => s.id === progress.at) || story.scenes[0]) as Scene;

  const go = (id: string) => {
    const next = { storyId: story.id, at: id, history: [...progress.history, scene.id] };
    onProgress(next);
  };

  const back = () => {
    const prev = progress.history.at(-1);
    if (!prev) return;
    onProgress({
      storyId: story.id,
      at: prev,
      history: progress.history.slice(0, -1)
    });
  };

  const restart = () => onProgress({ storyId: story.id, at: story.start, history: [] });

  return (
    <div className="story-player">
      <div className="story-head">
        <div className="emoji">{story.emoji || "📖"}</div>
        <div>
          <h3 className="title">{story.title}</h3>
          <div className="meta">{story.realm}</div>
        </div>
      </div>

      <div className="scene">
        <h4>{scene.title}</h4>
        <p>{scene.body}</p>
      </div>

      <div className="choices">
        {scene.choices.length === 0 ? (
          <button className="btn" onClick={restart}>Play Again</button>
        ) : (
          scene.choices.map(c => (
            <button key={c.id} className="btn choice" onClick={()=>go(c.goto)}>{c.text}</button>
          ))
        )}
        <button className="btn outline" onClick={back} disabled={progress.history.length === 0}>Back</button>
      </div>
    </div>
  );
};
