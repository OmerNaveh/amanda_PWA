import React from "react";
import { Question } from "models/game";
import { User } from "models/user";
type props = {
  participents: User[];
  question: Question;
  selectAnswer: (answer: User) => void;
};
const QuestionBoard = ({ question, participents, selectAnswer }: props) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-shrink-0 flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Question</h2>
        <p className="text-lg mb-2">{question.content}</p>
      </div>

      <div className="flex flex-col flex-grow min-h-0">
        <h3 className="text-xl font-semibold mb-3">Select your answer:</h3>
        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 overflow-y-auto min-h-0">
          {participents.map((participant) => (
            <button
              key={participant.id}
              onClick={() => selectAnswer(participant)}
              className="flex flex-col items-center p-4 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
            >
              <div
                className="h-16 w-16 rounded-full mb-2"
                style={{ backgroundColor: `rgb(${participant.color})` }}
              ></div>
              <span className="line-clamp-1 text-white">
                {participant.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBoard;
